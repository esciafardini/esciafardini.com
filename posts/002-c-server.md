
# THIS POST IS HALF BAKED AND UNFINISHED - I SHOULDNT HAVE DEPLOYED TEH SITE YET OMG no one is reading this but me it's fine

# What do we have here?

Rendering local markdown files as blog entries necessitated in a local server.

BUT WHY?

## From MDN:
```md
### Loading a local file
Local files from the same directory and subdirectories were historically treated as being from the same origin. This meant that a file and all its resources could be loaded from a local directory or subdirectory during testing, without triggering a CORS error.

Unfortunately this had security implications, as noted in this advisory: CVE-2019-11730. Many browsers, including Firefox and Chrome, now treat all local files as having opaque origins (by default). As a result, loading a local file with included local resources will now result in CORS errors.

Developers who need to perform local testing should now set up a local server. As all files are served from the same scheme and domain (localhost) they all have the same origin, and do not trigger cross-origin errors.
```

Since I am learning "Beej's Guide To Network Programming", it felt like a good time to try out writing an HTTP server in C.


note to future ted:
For turning reqs into C structs:
strstep and memchr (prob start with strstep?)

## Data Model
The initial server code is taken from Beej's Guide to Network Programming

