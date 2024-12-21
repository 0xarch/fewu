#!/bin/sh

### TEST SUIT
# This script will do a test for all functions in fewu.
# It will do in $HOME/fewu-test

cd "$HOME"

# ensure
if [ ! -d "fewu-test" ]; then
    echo "Directory fewu-test not found. try mkdir..."
    mkdir "fewu-test"
fi

echo "Entering $HOME/fewu-test..."
cd "$HOME/fewu-test"

echo "Display help..."
fewu --help

echo "Initializing..."
rm -r posts
fewu --init

echo "Touching 2 new fake posts..."
fewu --new
echo --new --tag TAG --category CATE

echo "Cloning default theme..."
git clone "git@github.com:0xarch/fewu-theme-arch" _themes/Arch

echo "Deploying..."
fewu