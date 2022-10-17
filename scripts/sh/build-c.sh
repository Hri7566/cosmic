#!/bin/bash

bash scripts/sh/clean-c.sh

export $(cat .env | xargs)

mkdir -p build/c
cd build/c

# export CC=/usr/bin/clang
# export CXX=/usr/bin/clang++

cmake ../../c
make
