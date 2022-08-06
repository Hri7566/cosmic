cmake_minimum_required(VERSION 3.16.3)

add_library(cosmic SHARED
    src/main.c
    src/color_log.c
)

target_include_directories(cosmic PUBLIC ./include)
