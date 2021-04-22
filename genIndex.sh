#!/bin/bash

ROOT=./site/notes/
HTTP="/"
OUTPUT="./site/notes/index.html" 

i=0
echo "<ul>" > $OUTPUT
for filepath in `find "$ROOT" -maxdepth 1 -mindepth 1 -type d| sort`; do
  path=`basename "$filepath"`
  echo "  <li><a href=\"/$path/\">$path</a></li>" >> $OUTPUT
done
echo "</ul>" >> $OUTPUT