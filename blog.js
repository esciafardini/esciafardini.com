// ---------- blog engine ----------
// Posts are plain markdown files in posts/. 
// Their metadata (title, date, tags, slug) lives in posts.json
// Routing is hash-based

// sidebar
const sideBarEl = document.getElementById('side-bar');

// list of blog entries
const blogListView = document.getElementById('blog-list');
const tagsEl = document.getElementById('tag-bar'); // tags (visible in blog list)

// blog post details
const blogPostView = document.getElementById('blog-post');
const postBody = document.getElementById('post-body');

// about page
const about = document.getElementById('about');

// nav side effects....
const navToAbout = () => {
  blogListView.style.display = 'none';
  tagsEl.style.display = 'none';
  blogPostView.style.display = 'none';
  about.style.display = '';
}

const navToPosts = () => {
  blogListView.style.display = '';
  tagsEl.style.display = '';
  about.style.display = 'none';
  blogPostView.style.display = 'none';
}

const navToPost = () => {
  blogListView.style.display = 'none';
  tagsEl.style.display = 'none';
  about.style.display = 'none';
  blogPostView.style.display = '';
}

let posts = [];  // will fill l8rrrr

const byDateDesc = (a, b) => b.date.localeCompare(a.date);  // newest first

// Render the post list, optionally filtered to a single tag.
function renderList(activeTag) {
  navToPosts();
  const allTags = [...new Set(posts.flatMap(p => p.tags))].sort();

  // Tag filter chips. "All" clears the filter.
  tagsEl.innerHTML =
    DOMPurify.sanitize(
      `<a class="tag ${activeTag ? '' : 'active'}" href="#blog">All</a>` +
      allTags.map(t =>
        `<a class="tag ${t === activeTag ? 'active' : ''}" ` +
        `href="#blog/tag/${encodeURIComponent(t)}">${t}</a>`).join(''));

  const visible = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts;

  sideBarEl.innerHTML = visible.map(p =>
    DOMPurify.sanitize(`
    <li class="post-item">
      <a class="post-title" href="#blog/post/${p.slug}">${p.title}</a>
      <div class="post-meta">
        <span>${p.date}</span>
        <span class="post-tags">${p.tags.map(t =>
      `<a class="tag" href="#blog/tag/${encodeURIComponent(t)}">${t}</a>`
    ).join('')}</span>
      </div>
    </li>
    `)
  ).join('');
}

// Fetch one post's markdown and render it.
function renderPost(slug) {
  navToPost()
  const post = posts.find(p => p.slug === slug);
  if (!post) { location.hash = '#blog'; return; }

  fetch(post.file)
    .then(r => r.text())
    .then(md => {
      postBody.innerHTML =
        DOMPurify.sanitize(`
          <h1>${post.title}</h1>
          <div class="post-meta"><span>${post.date}</span></div> `)
        +
        DOMPurify.sanitize(marked.parse(md));
      // Highlight any fenced code blocks the post contains.
      if (window.hljs) {
        postBody.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
      }
    });
}

function renderAbout() {
  navToAbout()
  fetch("about.md")
    .then(r => r.text())
    .then(md => {
      about.innerHTML =
        DOMPurify.sanitize(marked.parse(md));
      // Highlight any fenced code blocks the post contains.
      if (window.hljs) {
        postBody.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
      }
    })
}

// Map the current hash to a view.
function route() {
  const hash = location.hash;
  console.log('am i even here')
  if (!hash.startsWith('#blog') && !hash.startsWith('#about')) return;  // a normal doc anchor — ignore

  console.log('or herer')

  const postMatch = hash.match(/^#blog\/post\/(.+)$/);
  const tagMatch = hash.match(/^#blog\/tag\/(.+)$/);
  const aboutMatch = hash.match(/^#about$/);

  if (postMatch) renderPost(decodeURIComponent(postMatch[1]));
  else if (tagMatch) renderList(decodeURIComponent(tagMatch[1]));
  else if (aboutMatch) renderAbout();
  else renderList(null);
}

// Grab the posts.json file and store it in memory in variable `posts`
fetch('posts.json')
  .then(r => r.json())
  .then(data => { posts = data.sort(byDateDesc); renderList(null); route(); })
  .catch(() => {
    console.log("Things can happen. Something happened to me. I don't feel good!");
  });

window.addEventListener('hashchange', route);
