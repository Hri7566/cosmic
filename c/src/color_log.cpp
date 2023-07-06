#include "color_log.hpp"

int getStringSize(BYTE *arr, int max)
{
    BYTE *currentByte = arr;
    int size = 0;
    do
    {
        currentByte += 1;
        if (size >= max)
        {
            break;
        }
        size++;
    } while (*currentByte != 0x00);
    return size;
}

char *red(char *txt)
{
    int size = getStringSize(txt, 2048) + 5 + 4;
    char *newStr = (char *)malloc(size);

    newStr[0] = '\x1b';
    newStr[1] = '[';
    newStr[2] = '3';
    newStr[3] = '1';
    newStr[4] = 'm';

    int i;

    for (i = 1; i < size; i++)
    {
        newStr[i] = txt[i - 1];
    }

    newStr[i + 1] = '\x1b';
    newStr[i + 2] = '[';
    newStr[i + 3] = '0';
    newStr[i + 4] = 'm';

    return newStr;
}

void freeString(char *str)
{
    free(str);
}
