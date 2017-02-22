#!/bin/bash

set -e

# use ENV WORKING_DIR if present
# use to current directory if not
if [ -z "$WORKING_DIR" ];
  then
  export WORKING_DIR=".";
fi;

cd "$WORKING_DIR"
pwd
npm install -g grunt-cli
npm install -g json
npm install
cp example.env .env
grunt build
ls -l dist/
git init

# cat config.json
# cat .env

printf "\n\nCongratulations! \n\n"

grunt
