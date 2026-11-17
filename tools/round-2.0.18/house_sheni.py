# -*- coding: utf-8 -*-
# Round 2.0.17: the second house's built folder (index.html, bundle.js, manifest.json), made from what the repository holds - for
# tools/build-unified.mjs --sheni <out>, when the house's own sources and its deliver/make.sh are not at hand.
#
#   python3 -I tools/round-2.0.17/house_sheni.py <bundle.js> <house version> <out folder>
#
# index.html - unified-plugin/sheni/index.html less the line the unified build adds (<script src="../house-bridge.js">), its version in
#   the bar (#version) written anew;
# manifest.json - only what build-unified.mjs reads of a house: name, version, permissions, the startup program and the toolbar item
#   (the unified manifest's second program and item: the build writes their books anew from unified/books.json).
# Checked before use: with the bundle of 2.0.16 and the version 2.0.7, the build gave unified-plugin/ of 2.0.16 byte for byte, and
# the one-file HTML of the branch html too.
import json, os, re, sys

bundle, ver, out = sys.argv[1:4]
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
os.makedirs(out, exist_ok=True)
html = open(os.path.join(R, 'unified-plugin', 'sheni', 'index.html'), encoding='utf-8').read()
tag = '\n<script src="../house-bridge.js"></script>'
assert html.count(tag) == 1, 'the bridge line'
html = html.replace(tag, '')
html, n = re.subn(r'<span id="version">v[\d.]+</span>', '<span id="version">v' + ver + '</span>', html)
assert n == 1, 'the version in the bar'
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
open(os.path.join(out, 'bundle.js'), 'w', encoding='utf-8').write(open(bundle, encoding='utf-8').read())
m = json.load(open(os.path.join(R, 'unified-plugin', 'manifest.json'), encoding='utf-8'))
st = m['contributes']['startup']
hm = {'name': 'בית שני', 'version': ver, 'permissions': m['permissions'],
      'contributes': {'startup': {'programs': [st['programs'][1]], 'toolbarItems': [st['toolbarItems'][1]]}}}
json.dump(hm, open(os.path.join(out, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('the second house, ' + ver + ': ' + out)
