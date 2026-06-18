flags=-O2 -Wall -std=c23

.PHONY: all clean

all: run

server: run.o
	cc $(flags) $^ -o $@

run.o: run.c
	cc $(flags) -c $<

clean:
	rm -f *.o run
