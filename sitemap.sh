find . -type f -not -path "./.git/*" > sitemap-temp.txt
stdbuf -o0 cut -c2- sitemap-temp.txt > sitemap-temp2.txt
for i in $(cat sitemap-temp2.txt); do echo "https://arkanic.github.io$i"; done > sitemap-temp3.txt
for i in $(cat sitemap-temp3.txt); do echo $i | awk '{gsub("index.html",""); print}'; done > sitemap.txt
sed -i "/sitemap-temp.txt/d" sitemap.txt
sed -i "/sitemap-temp2.txt/d" sitemap.txt
sed -i "/sitemap-temp3.txt/d" sitemap.txt
rm -f sitemap-temp.txt
rm -f sitemap-temp2.txt
rm -f sitemap-temp3.txt