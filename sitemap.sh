find . -type f -not -path "./.git/*" > sitemap-temp.txt
stdbuf -o0 cut -c2- sitemap-temp.txt > sitemap-temp2.txt
for i in $(cat sitemap-temp2.txt); do echo "https://arkanic.github.io$i"; done > sitemap-temp3.txt
for i in $(cat sitemap-temp3.txt); do echo $i | awk '{gsub("index.html",""); print}'; done > sitemap.txt
rm -f sitemap.xml
for i in $(cat sitemap.txt); do echo "<url><loc>$i</loc><changefreq>weekly</changefreq></url>"; done >> sitemap.xml
echo "$(echo -n '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'; cat sitemap.xml)" > sitemap.xml
echo "$(cat sitemap.xml; echo -n '</urlset>')" > sitemap.xml
sed -i "/sitemap-temp.txt/d" sitemap.txt
sed -i "/sitemap-temp2.txt/d" sitemap.txt
sed -i "/sitemap-temp3.txt/d" sitemap.txt
rm -f sitemap-temp.txt
rm -f sitemap-temp2.txt
rm -f sitemap-temp3.txt