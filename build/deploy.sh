#!/bin/bash

# -------------------------------------------------------
# Usage:
# cd build/
# ./deploy.sh (push the content from retail-shops branch to gh-pages branch)
# -------------------------------------------------------

cd ../
echo "Deploying...."
git checkout gh-pages
git pull origin retail-shops
git push origin gh-pages
git checkout retail-shops
echo "Finished"
