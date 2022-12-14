cmake_minimum_required(VERSION 3.16.3)

project(cosmic VERSION 1.0)
set(CMAKE_CXX_STANDARD 14)

# add_library(cosmic SHARED
#     src/main.c
#     src/color_log.c
# )

file(GLOB_RECURSE libcosmic_src
    "src/*.c"
    "src/*.h"
    "src/*.cpp"
    "src/*.cxx"
    "src/*.hpp"
)

message(${libcosmic_src})

add_library(cosmic SHARED
    ${libcosmic_src}
)

target_include_directories(cosmic PUBLIC ./include)
