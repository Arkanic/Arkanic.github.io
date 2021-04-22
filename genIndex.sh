#!/bin/bash

ROOT=./site/notes/
HTTP="/"
OUTPUT="./site/notes/index.html" 

i=0
echo "<!DOCTYPE html><html><head><title>Notes Index</title></head><body><ul>" > $OUTPUT
for filepath in `find "$ROOT" -maxdepth 1 -mindepth 1 -type d| sort`; do
  path=`basename "$filepath"`
  formattedpath="${path//-/ }"
  echo "  <li><a href=\"./$path/\">$formattedpath</a></li>" >> $OUTPUT
done
echo "</ul></body></html>" >> $OUTPUT