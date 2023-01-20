#ifndef COSMIC_COMMANDS
#define COSMIC_COMMANDS

typedef struct {
    char* id;
    char** aliases;
    char* (*func)(int, char **);
} Command;

#endif
