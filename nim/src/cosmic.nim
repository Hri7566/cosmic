type Color = enum cRed, cBlue, cGreen

proc test2(): cstring {.exportc.} =
    return "test from cosmic.nim"
