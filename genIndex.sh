#!/bin/bash

ROOT=./site/notes/
HTTP="/"
OUTPUT="./site/notes/index.html" 
OUTPUTJSON="./site/notes/index.json"

i=0
echo "<!DOCTYPE html><html><head><title>Notes Index</title></head><body><ul>" > $OUTPUT
echo '{"files":[' > $OUTPUTJSON
for filepath in `find "$ROOT" -maxdepth 1 -mindepth 1 -type d| sort`; do
  path=`basename "$filepath"`
  formattedpath="${path//-/ }"
  echo "<li><a href=\"./$path/\">$formattedpath</a></li>" >> $OUTPUT
  echo '{"name":"${formattedpath}","location":"${path}"},' >> $OUTPUTJSON
done
echo "</ul></body></html>" >> $OUTPUT
truncate -s-2 $OUTPUTJSON
echo "]}" >> $OUTPUTJSON