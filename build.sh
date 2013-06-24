#!/bin/bash


if [ $# != 2 ];then
	echo "usage: \"$0 <country> <device>\" to generate an application zip" >&2
	exit -1
fi

country=$1
device=$2
variant=${country}/${device}
pathSharedBase="/var/www/html/downloads"
INITIALWD=`pwd`

mkdir -p ${variant}/build/
cp -r basePack ${variant}/build/package

cat config.json | sed 's/${VARIANT}/'${variant//\//\\\/}'/' >> ${variant}/build/package/config.json

cp -r slidesPack/${country}/${device}/ ${variant}/build/package/gphx/slides

cd ${variant}/build/package/
zip -r ../package.zip *
cd ..
rm -rf package

zipSize=`stat -c %s package.zip`

cd $INITIALWD

cat package.manifest | sed 's/${VARIANT}/'${variant//\//\\\/}'/' | sed 's/${ZIPSIZE}/'${zipSize}'/' >> ${variant}/build/package.manifest

cat index.html | sed 's/${VARIANT}/'${variant//\//\\\/}'/' >> ${variant}/index.html

cp -r $country ${pathSharedBase}/

rm -rf $country


