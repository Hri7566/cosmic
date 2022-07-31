cmake_minimum_required(VERSION 3.23.2)

add_library(cosmic SHARED src/main.c)
target_include_directories(cosmic PUBLIC ./include)
