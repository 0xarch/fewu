#!/bin/bash

### FUNCTION TEST UNIT ###
### ****ONLY LINUX**** ###
##########################

PKG_DIR="$(pwd)"
TEST_DIR="/tmp/io.fewu-swg.fewu/unittest"

# ensure
if [ ! -d "$TEST_DIR" ]; then
    mkdir "$TEST_DIR" -p
fi

# find npm
NPM=npm
if which pnpm; then
    NPM=pnpm
fi

if ! which "$NPM"; then
    echo "Abort on Error: no npm found!"
    exit
fi

cd "$TEST_DIR"

pwd

rm -r "$TEST_DIR/*"

"$NPM" i "$PKG_DIR"
"$NPM" i fewu-cli

fewu --init

"$NPM" i

fewu --server

xdg-open localhost:3000

cd $PKG_DIR