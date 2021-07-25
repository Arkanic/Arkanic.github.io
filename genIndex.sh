#!/bin/bash

ROOT=./site/projects/
HTTP="/"
OUTPUT="./site/projects/index.html" 
OUTPUTJSON="./site/projects/index.json"

i=0
echo "<!--#include virtual=\"components/top.html\"--><title>Projects Index</title><!--#include virtual=\"components/top2.html\"--><ul>" > $OUTPUT
echo '{"files":[' > $OUTPUTJSON
for filepath in `find "$ROOT" -maxdepth 1 -mindepth 1 -type d| sort`; do
  path=`basename "$filepath"`
  formattedpath="${path//-/ }"
  echo "<li><a href=\"./$path/\">$formattedpath</a></li>" >> $OUTPUT
  echo "{\"name\":\"${formattedpath}\",\"location\":\"./${path}/\"}," >> $OUTPUTJSON
done
echo "</ul><!--#include virtual=\"components/bottom.html\"-->" >> $OUTPUT
truncate -s-2 $OUTPUTJSON
echo "]}" >> $OUTPUTJSON
