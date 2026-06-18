# Empty/Closed connections underflow a loop bount (WTF?)
recv returning 0 means the client closed the connection — you don't check for that, only < 0. The empty buffer flows into the constructor, where for (i = 0; i < strlen(request_string) - 1; i++). strlen returns an unsigned size_t; when the string is empty, 0 - 1 wraps to ~18 quintillion, so the loop walks off into
memory. Browsers routinely open speculative connections and close them without sending — guaranteed eventual crash.

# strtok bugs
- The parser trusts strtok never returns NULL.
If the request is malformed (or empty), strtok returns NULL, and you immediately pass it to strcmp(method, "GET"), strcmp(URI, ...), and atof(HTTP_Version).
Any strcmp(NULL, ...) is a segfault. You never check a single strtok result before using it.

# accept on uninitialized addr_size
- addr_size is uninitialized when passed to accept.
socklen_t addr_size; (line 138) is never set. accept expects it to hold the size of their_addr going in. Passing garbage is undefined behavior — works by luck
on macOS often, but it's a real bug.

# dangling pointer hazards in request data model
- request.URI and friends are dangling-pointer hazards by design.
- strtok returns pointers into received_req, which is a stack buffer in main's loop. It happens to still be alive when send_response runs this iteration, so you get away with it — but it means the HTTPRequest struct can never outlive one loop turn. Mixing those borrowed pointers with string literals like "/index.html" in the same field is a trap waiting for you.

# bad use of getc
- char c for getc. getc returns an int so it can represent all 256 byte values plus EOF. Storing it in a char means a legitimate 0xFF byte gets read as EOF on signed-char platforms, truncating binary files (fonts, images, your favicon.ico). Use int.

# getaddrinfo needs to be checked and freed
- getaddrinfo's return value (gai) is captured but never checked, and res is never freeaddrinfo'd. If lookup fails, res is garbage and bind dereferences it.

# Nothing done upon uninitialized Method (need to fail)
- request.Method is uninitialized if the method isn't GET — same class of bug as #1, just less often fatal because send_response compares it to 2 rather than
dereferencing it.
