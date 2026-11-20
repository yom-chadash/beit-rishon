#!/bin/bash
# round 3.0.6: the Second House's bundle patched anew from its committed source (3.0.5), patch by patch
set -e
cd /home/claude/repo/beit-rishon
git checkout -q sheni-src/bundle.js
for f in $(cat tools/round-3.0.6/order.txt 2>/dev/null); do python3 -I tools/round-3.0.6/$f.py; done
python3 -I tools/round-3.0.6/release_306.py --sheni
node tools/safe-lines.mjs sheni-src/bundle.js
node --check sheni-src/bundle.js
python3 -I tools/round-2.0.18/house_sheni.py sheni-src/bundle.js 2.0.15 /tmp/t-sheni > /tmp/house.log 2>&1
tail -1 /tmp/house.log
