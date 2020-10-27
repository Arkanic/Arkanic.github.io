find . -type f -not -path "./.git/*" > sitemap-temp.txt
stdbuf -o0 cut -c2- sitemap-temp.txt > sitemap-temp2.txt
for i in $(cat sitemap-temp2.txt); do echo "https://arkanic.github.io$i"; done > sitemap.txt