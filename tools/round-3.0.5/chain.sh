#!/bin/bash
set -e
cd /home/claude/repo/beit-rishon
git checkout -q sheni-src/bundle.js
for f in musicians_patch captions_patch altar_patch meir_patch avnet_patch menorot_patch night_watch_patch night_sit_patch demolist_patch rings_patch shiloach_patch; do python3 -I tools/round-3.0.5/$f.py; done
python3 -I tools/round-3.0.5/release_305.py --sheni
node tools/safe-lines.mjs sheni-src/bundle.js
node --check sheni-src/bundle.js
python3 -I tools/round-2.0.18/house_sheni.py sheni-src/bundle.js 2.0.14 /tmp/t-sheni > /tmp/house.log 2>&1
tail -1 /tmp/house.log
