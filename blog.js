// ---------- Tiny blog engine ----------
// Posts are plain markdown files in posts/. Their metadata (title, date,
// tags, slug) lives in posts.json, so we never have to parse front-matter.
// Routing is hash-based and only reacts to hashes that start with "#blog",
// which leaves the existing in-page anchor links (#git, #folds, ...) alone.

const listEl   = document.getElementById('post-list');
const tagBarEl = document.getElementById('tag-bar');
const listView = document.getElementById('blog-list');
const postView = document.getElementById('blog-post');
const postBody = document.getElementById('post-body');

let posts = [];  // filled in once posts.json loads

const byDateDesc = (a, b) => b.date.localeCompare(a.date);  // newest first

// Render the post list, optionally filtered to a single tag.
function renderList(activeTag) {
  const allTags = [...new Set(posts.flatMap(p => p.tags))].sort();

  // Tag filter chips. "All" clears the filter.
  tagBarEl.innerHTML =
    `<a class="tag ${activeTag ? '' : 'active'}" href="#blog">All</a>` +
    allTags.map(t =>
      `<a class="tag ${t === activeTag ? 'active' : ''}" ` +
      `href="#blog/tag/${encodeURIComponent(t)}">${t}</a>`).join('');

  const visible = activeTag
    ? posts.filter(p => p.tags.includes(activeTag))
    : posts;

  listEl.innerHTML = visible.map(p => `
    <li class="post-item">
      <a class="post-title" href="#blog/post/${p.slug}">${p.title}</a>
      <div class="post-meta">
        <span>${p.date}</span>
        <span class="post-tags">${p.tags.map(t =>
          `<a class="tag" href="#blog/tag/${encodeURIComponent(t)}">${t}</a>`
        ).join('')}</span>
      </div>
    </li>`).join('');

  listView.style.display = '';
  postView.style.display = 'none';
}

// Fetch one post's markdown and render it.
function renderPost(slug) {
  const post = posts.find(p => p.slug === slug);
  if (!post) { location.hash = '#blog'; return; }

  fetch(post.file)
    .then(r => r.text())
    .then(md => {
      postBody.innerHTML =
        `<h1>${post.title}</h1>` +
        `<div class="post-meta"><span>${post.date}</span></div>` +
        marked.parse(md);
      // Highlight any fenced code blocks the post contains.
      if (window.hljs) {
        postBody.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
      }
      listView.style.display = 'none';
      postView.style.display = '';
    });
}

// Map the current hash to a view.
function route() {
  const hash = location.hash;
  if (!hash.startsWith('#blog')) return;  // a normal doc anchor — ignore

  const postMatch = hash.match(/^#blog\/post\/(.+)$/);
  const tagMatch  = hash.match(/^#blog\/tag\/(.+)$/);

  if      (postMatch) renderPost(decodeURIComponent(postMatch[1]));
  else if (tagMatch)  renderList(decodeURIComponent(tagMatch[1]));
  else                renderList(null);
}

// Load the manifest once, then show whatever the current URL asks for.
fetch('posts.json')
  .then(r => r.json())
  .then(data => { posts = data.sort(byDateDesc); renderList(null); route(); })
  .catch(() => {
    console.log('Could not load posts.json — are you serving over http:// rather than opening the file directly?');
  });

window.addEventListener('hashchange', route);
