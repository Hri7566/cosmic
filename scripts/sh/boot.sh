#!/bin/bash

echo "Enabling all scripts"
scripts/sh/chmod.sh

echo "Installing packages"
bun i

echo "Building Cosmic"
bun build

echo "Starting Cosmic"
bun start
