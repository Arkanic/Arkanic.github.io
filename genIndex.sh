#!/bin/bash

ROOT=./site/projects/
HTTP="/"
OUTPUT="./site/projects/index.html" 
OUTPUTJSON="./site/projects/index.json"

i=0
echo "<!DOCTYPE html><html><head><title>Projects Index</title><link rel=\"stylesheet\" type=\"text/css\" href=\"../src/css/index.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"../src/css/global.css\"></head><body><ul>" > $OUTPUT
echo '{"files":[' > $OUTPUTJSON
for filepath in `find "$ROOT" -maxdepth 1 -mindepth 1 -type d| sort`; do
  path=`basename "$filepath"`
  formattedpath="${path//-/ }"
  echo "<li><a href=\"./$path/\">$formattedpath</a></li>" >> $OUTPUT
  echo "{\"name\":\"${formattedpath}\",\"location\":\"./${path}/\"}," >> $OUTPUTJSON
done
echo "</ul></body></html>" >> $OUTPUT
truncate -s-2 $OUTPUTJSON
echo "]}" >> $OUTPUTJSON