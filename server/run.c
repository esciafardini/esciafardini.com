/* dev_server.c */
#include "HTTPRequest.c"
#include <arpa/inet.h>
#include <errno.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define PORT "8888"
#define BACKLOG 10

// waitpid - this is how the parent process handles dead child processes
void sigchld_handler(int s) {
  int saved_errno = errno;
  // for all child processes -
  // NULL = discard its exit status
  // WNOHANG = don't block execution, just reap the dead child processes
  while (waitpid(-1, NULL, WNOHANG) > 0)
    ;

  errno = saved_errno;
}

int send_response(struct HTTPRequest req, int client_fd) {

  if (req.expected_content_type == NULL) {
    char *bad_request = "HTTP/1.1 400 Oh, Hell Na\r\n"
                        "Content-Type: text/html;charset=utf-8\r\n"
                        "\r\n"
                        "<h1>400 — BAD REQUEST</h1>";
    send(client_fd, bad_request, strlen(bad_request), 0);
    return -1;
  }

  if (req.Method != 2) {
    printf("This server only takes GET requests, babe");
    return -1;
  }

  char headers[1024];
  snprintf(headers, sizeof(headers),
           "HTTP/1.1 200 OK\r\n"
           "Content-Type: %s;"
           "charset=utf-8\r\n" // concats if new line with new string
           "\r\n",
           req.expected_content_type);

  char path[1024];
  // snprintf(path, sizeof(path), "..%s", req.URI);
 
  // removing these dots so it can be run from parent dir
  snprintf(path, sizeof(path), ".%s", req.URI);

  send(client_fd, headers, strlen(headers), 0);
  //
  // "rb" = binary mode; getc returns int so 0xFF bytes aren't mistaken for EOF
  FILE *index_fd = fopen(path, "rb");
  if (index_fd == NULL) {
    char *not_found = "HTTP/1.1 404 Not Found\r\n"
                      "Content-Type: text/html;charset=utf-8\r\n"
                      "\r\n"
                      "<h1>404 — FILE NOT FOUND</h1>";
    send(client_fd, not_found, strlen(not_found), 0);
    return -1;
  }
  int c;
  while ((c = getc(index_fd)) != EOF) {
    unsigned char byte = (unsigned char)c;
    send(client_fd, &byte, 1, 0);
  }

  return 0;
}

int main() {
  printf("here we go...\n");
  // SOCKET
  int sockfd;
  // could set protocol to 0, but I don't want to. sue me.
  //
  //
  //                   IPv4       2-way     TCP
  if ((sockfd = socket(AF_INET, SOCK_STREAM, 6)) == -1) {
    perror("socket error");
    exit(-1);
  }

  // avoid address already in use b.s. in dev
  int yes = 1;
  setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof yes);

  // the socket is just a file descriptor
  // we need to tell the library that we expect a connection from a specific
  // IP address AND we need to specify a port...how????

  // BIND
  //
  struct addrinfo hints, *res;
  //   I want to listen on a port
  memset(&hints, 0, sizeof(hints)); // zero EVERYTHING first
  hints.ai_family = AF_INET;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_flags = AI_PASSIVE;

  int gai;
  if ((gai = getaddrinfo(NULL, PORT, &hints, &res)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(gai));
        return 1;
    }

  int bind_result = bind(sockfd, res->ai_addr, res->ai_addrlen);
  if (bind_result < 0) {
    perror("bind error");
    exit(-1);
  }
  //
  //
  // // LISTEN
  //
  int listen_result = listen(sockfd, 20);
  if (listen_result < 0) {
    perror("listen error");
    exit(-1);
  }
  //
  //
  printf("Server is listening for requests on port %s...\n", PORT);

  while (1) {
    // ACCEPT
    struct sockaddr_storage their_addr;
    socklen_t addr_size;
    int client_fd = accept(sockfd, (struct sockaddr *)&their_addr, &addr_size);

    if (client_fd < 0) {
      perror("accept error");
      exit(-1);
    }

    int max_len = 100000;
    char received_req[max_len];
    memset(received_req, 0, max_len);

    int num_bytes = recv(client_fd, received_req, max_len, 0);

    if (num_bytes < 0) {
      perror("recv error");
      exit(-1);
    }

    struct HTTPRequest req = http_request_constructor(received_req);

    printf("--------------------------------------\n");
    printf("--------------------------------------\n");
    printf("URI: %s\n", req.URI);
    printf("METHOD: %d\n", req.Method);
    printf("HTTPVERSION: %f\n", req.HTTP_Version);
    printf("--------------------------------------\n");
    send_response(req, client_fd);

    close(client_fd);
  }

  return 0;
}
