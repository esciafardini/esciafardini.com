When I started working on this website locally, I ran into a problem that I'd never seen before.

Here is the posts.json file that drives the links on the main page (as of 06/23/2026):
```json
[
  {
    "slug": "http-server-part-1",
    "title": "Opaque Origins: HTTP Server From Scratch",
    "date": "2026-06-23",
    "tags": ["http", "c", "self-referential"],
    "file": "posts/003-http-server-part-1.md"
  },
  {
    "slug": "deploying",
    "title": "Deploying This Website",
    "date": "2026-06-18",
    "tags": ["self-referential", "deployment"],
    "file": "posts/002-deploying.md"
  },
  {
    "slug": "website-about-itself",
    "title": "Website About Itself",
    "date": "2026-05-27",
    "tags": ["self-referential"],
    "file": "posts/001-website-about-itself.md"
  }
]
```

The issue first surfaced when I attempted to run the following code:
```javascript
// Grab the posts.json file and store it in memory in variable `posts`
fetch('posts.json')
  .then(r => r.json())
  .then(data => { posts = data.sort(byDateDesc); renderList(null); route(); })
  .catch(() => {
    console.log("Things can happen. Something happened to me. I don't feel good!");
  });
```

Navigating to the index.html file in browser gave me a blank page and the following console errors:
```markdown
Access to fetch at 'file:///Users/esciafardini/path-stuff/this-website/posts.json' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
posts.json:1  

Failed to load resource: net::ERR_FAILED

blog.js:137 Things can happen. Something happened to me. I don't feel good!
```
But what does it all mean? Why can't I access other files that live alongside index.html? What is the matter with this thing?

## MDN Docs:
```md
Local files from the same directory and subdirectories were historically treated as being from the same origin. This meant that a file and all its resources could be loaded from a local directory or subdirectory during testing, without triggering a CORS error.

```
This makes sense to me. They *are* from the same origin, right?

What does origin really mean though? According to MDN (again) - it's defined by the scheme (protocol), the hostname (domain), and the port of the URL attached to it.

![origin](posts/images/003-origin.png)

## MDN Docs (continued):
```markdown
Unfortunately this had security implications, as noted in advisory CVE-2019-11730. Many browsers, including Firefox and Chrome, now treat all local files as having opaque origins (by default). As a result, loading a local file with included local resources will now result in CORS errors.

Developers who need to perform local testing should now set up a local server. As all files are served from the same scheme and domain (localhost) they all have the same origin, and do not trigger cross-origin errors.
```
It turns out that URLs prepended with protocol `file:` are considered to have an "opaque origin". An opaque origin is *never* considered equal to *any* other origin. You got that?!

## So what do I do?
I *could* just use a python http server or something, but that wouldn't be very educational.

At the moment, I am working through "Beej's Guide To Network Programming". I need an HTTP server. This feels like a good opportunity to write an HTTP server in C. Stay tuned for the next blog post where I fumble my way through the code.
