#!/bin/sh
# 2.0.12 - the publishing, in the order of unified/DEV_NOTES.md "סדר הפרסום": the branch html first, then main (the store), and README.md
# (written anew). Run after deliver/make.sh and the checks (qa-unified, the full scans of both houses).
set -e
V=2.0.12; V1=1.4.5; V2=2.0.3; DATE=16.11.2026
H="/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא - גרסה $V.html"
PKG="/home/claude/dist-unified/בית-המקדש-$V.otzplugin"
NEWS=/home/claude/tools211/news.md
R=/home/claude/beit-rishon
U=/home/claude/unified-wt
T=/home/claude/tools211
[ -f "$H" ] && [ -f "$PKG" ] || { echo "the built files are missing"; exit 1; }
grep -q "\"version\": \"$V\"" /home/claude/dist-unified/plugin/manifest.json || { echo "dist-unified is not $V"; exit 1; }
# 1. the shell's sources and tools into the repository; the round's own files (the plan, the sources gathered, the reviewers' reports,
#    the patches of the review round, the checks)
cp "$U"/unified/* "$R/unified/"
cp "$U/tools/build-unified.mjs" "$U/tools/publish-release.sh" "$U/tools/make-readme.py" "$R/tools/"
D="$R/tools/round-2.0.12"
mkdir -p "$D/checks" "$D/beit-sheni-tools"
cp "$T/PLAN.md" "$T/round_212.py" "$T/form_212.py" "$T/publish_212.sh" "$T/news.md" "$D/"
cp /home/claude/qa/r211/payisshots.mjs /home/claude/qa/r211/fix/mochk.mjs /home/claude/qa/r211/fix/klfull.mjs "$D/checks/"
# (the second house's sources are not in this repository; the steps this round changed are kept here for reference)
cp /home/claude/b2src/tools/rows_211r.py /home/claude/b2src/src/55-payis.js "$D/beit-sheni-tools/"
# the Rambam's "מכסה גבוה יורד בגלגל" as a cover of its own - built, set aside until the user decides (form_212.py)
cp /home/claude/rev211/fix/bak/40-altar.with-cover.js "$D/beit-sheni-tools/40-altar.with-cover.js"
# 2. the branch html (before main)
cd "$R" && sh tools/publish-release.sh html "$V" "$H"
# 3. the folder the store publishes from
python3 -I - <<'PYEOF'
import os, shutil, filecmp
src, dst = '/home/claude/dist-unified/plugin', '/home/claude/beit-rishon/unified-plugin'
keep = set()
for root, dirs, files in os.walk(src):
    for f in files:
        s = os.path.join(root, f); rel = os.path.relpath(s, src); d = os.path.join(dst, rel); keep.add(rel)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        if not os.path.exists(d) or not filecmp.cmp(s, d, shallow=False): shutil.copy2(s, d)
for root, dirs, files in os.walk(dst):
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), dst)
        if rel not in keep: os.remove(os.path.join(root, f)); print('removed', rel)
print('unified-plugin mirrored')
PYEOF
# 4. README.md, anew
python3 -I tools/make-readme.py "$V" "$V1" "$V2" "$DATE" "$NEWS" README.md
# 5. main
git add -A
git commit -q -F - <<MSGEOF
2.0.12 — בית ראשון 1.4.5 + בית שני 2.0.3: הדגמת הפייסות (הממונה עולה במדרגות החדשות של בית המוקד), המבט של שערי חולדה, מראה מקום בכרטיס הכבש

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ERwCywgLN9329RVE5j6Sa5
MSGEOF
git push -q origin main
echo "main pushed: $(git rev-parse --short HEAD)"
