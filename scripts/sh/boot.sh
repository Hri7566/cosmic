#!/bin/bash

echo "Enabling all scripts"
scripts/sh/chmod.sh

echo "Installing packages"
yarn

echo "Building Cosmic"
yarn build

echo "Starting Cosmic"
yarn start
