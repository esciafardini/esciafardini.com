# esciafardini webpage

## Running locally

The site fetches `posts.json` and the Markdown files in `posts/`
opening `index.html` directly via `file://` will fail due to browser CORS rules

Serve it over HTTP instead.

## MacOS solution:
`python3 -m http.server 8000`

## Learning solution:
code an HTTP server in C, compile it & run it (WIP)

## Structure
- `index.html` — the single-page app
- `posts.json` — index of blog posts
- `posts/` — Markdown source for each post
