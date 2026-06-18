/* HTTPRequest.c */
#include "HTTPRequest.h"
#include <stdlib.h>
#include <string.h>

struct HTTPRequest http_request_constructor(char *request_string) {
  for (int i = 0; i < strlen(request_string) - 1; i++) {
    if (request_string[i] == '\n' && request_string[i + 1] == '\n') {
      request_string[i + 1] = '|';
    }
  }
  char *request_line = strtok(request_string, "\n");
  char *header_fields = strtok(NULL, "|");
  char *body = strtok(NULL, "|");

  struct HTTPRequest request = {0};

  char *method = strtok(request_line, " ");

  // we only allow GET for now
  if (strcmp(method, "GET") == 0) {
    request.Method = GET;
  }

  char *URI = strtok(NULL, " ");
  request.URI = URI;

  char *dot = strrchr(URI, '.'); // after the dot

  printf("dot: %s\n", dot);

  if (strcmp(URI, "/") == 0) {
    request.URI = "/index.html";
    request.expected_content_type = "text/html";
  } else if (strcmp(URI, "/style.css") == 0) {
    request.expected_content_type = "text/css";
  } else if (strcmp(URI, "/blog.js") == 0) {
    request.expected_content_type = "text/javascript";
  } else if (strcmp(URI, "/favicon.ico") == 0) {
    request.expected_content_type = "image/x-icon";
  } else if (strcmp(URI, "/posts.json") == 0) {
    request.expected_content_type = "application/json";
  } else if (dot && !strcmp(dot, ".md")) {
    request.expected_content_type = "text/markdown";
  } else if (dot && !strcmp(dot, ".png")) {
    request.expected_content_type = "image/png";
  }

  char *HTTP_Version = strtok(NULL, " ");
  strtok(HTTP_Version, "/");
  HTTP_Version = strtok(NULL, "/");
  request.HTTP_Version = (float)atof(HTTP_Version);

  return request;
}
