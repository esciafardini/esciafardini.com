/* HTTPRequest.h */
#include <stdio.h>

enum HTTPMethods {
  HEAD = 1,
  GET = 2,
  POST = 3,
  PUT = 4,
  DELETE = 5,
  PATCH = 6
};

struct HTTPRequest {
  int Method;
  char *URI;
  char *expected_content_type;
  float HTTP_Version;
};

struct HTTPRequest http_request_constructor(char *request_string);
