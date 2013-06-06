#!/bin/bash

# -------------------------------------------------------
# Usage:
# cd build/
# ./deploy.sh (push the content from retail-shops branch to gh-pages branch)
# -------------------------------------------------------

cd ../
echo "Deploying...."
git checkout gh-pages
git fetch origin retail-shops
git reset --hard FETCH_HEAD
git push -f origin gh-pages
git checkout retail-shops
echo "Finished"
