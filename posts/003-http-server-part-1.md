When I started working on this website locally, I ran into a problem that I'd never seen before.

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
This is the posts.json file that drives the links on the main page (as of 06/23/2026).

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
The origin of `posts.json` is 'null'? What does that mean? Why can't I fetch files that live in the same directory as my index.html? Let's see what MDN has to say about this.

## MDN Docs:
```md
Local files from the same directory and subdirectories were historically treated as being from the same origin. This meant that a file and all its resources could be loaded from a local directory or subdirectory during testing, without triggering a CORS error.

```
Historically implies that things have changed - but this makes sense to me. Two files in the same directory *should be* from the same origin, right?

But what does origin really mean? 

Checking MDN (again) - they say `origin` of a URL is defined by scheme (protocol), hostname (domain), and port.

![origin](posts/images/003-origin.png)

So why is the origin of my file 'null'? God, I love MDN - LET'S LOOK AT IT AGAIN!

## MDN Docs (continued):
```markdown
Unfortunately this had security implications, as noted in advisory CVE-2019-11730. Many browsers, including Firefox and Chrome, now treat all local files as having opaque origins (by default). As a result, loading a local file with included local resources will now result in CORS errors.

Developers who need to perform local testing should now set up a local server. As all files are served from the same scheme and domain (localhost) they all have the same origin, and do not trigger cross-origin errors.
```
It turns out all URLs prepended with the `file:` protocol are considered to have an "opaque origin". An opaque origin is *never* considered equal to *any* other origin. You got that?!

## So what do I do?
I *could* just use a python http server or something, but that wouldn't be very educational.

At the moment, I am reading through "Beej's Guide To Network Programming" which is pretty convenient because it has a lot of the boilerplate code I would need to roll out my own custom HTTP server in C. Stay tuned for a future blog post where I fumble my way through the code.
