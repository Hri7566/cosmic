#!/bin/bash

echo "Enabling all scripts"
scripts/sh/chmod.sh

echo "Installing packages"
pnpm

echo "Building Cosmic"
pnpm build

echo "Starting Cosmic"
pnpm start
