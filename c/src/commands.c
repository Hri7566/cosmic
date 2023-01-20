#include "Command.h"
#include "commands.h"

Command commands[] = {
    {
        .id = "help",
        .aliases = {"help", "h"}
    }
};

char* runCommand(int argc, char** argv) {
    char* response = "Unknown command";
    
    return response;
}
