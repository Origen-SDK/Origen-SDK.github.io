#!/bin/sh

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git add .
git commit --message "Travis build: $TRAVIS_BUILD_NUMBER [ci skip]"

git remote add github https://${GH_TOKEN}@github.com/Origen-SDK/Origen-SDK.github.io
git push github HEAD:master
