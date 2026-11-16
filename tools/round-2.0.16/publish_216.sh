#!/bin/sh
# 2.0.16 - the publishing, in the order of unified/DEV_NOTES.md "סדר הפרסום": the branch html first, then main (the store), and README.md
# (written anew). Run after deliver/make.sh and the checks (qa-unified, the full scans of both houses).
set -e
V=2.0.16; V1=1.4.7; V2=2.0.7; DATE=16.11.2026
H="/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא - גרסה $V.html"
PKG="/home/claude/dist-unified/בית-המקדש-$V.otzplugin"
NEWS=/home/claude/tools216/news.md
R=/home/claude/beit-rishon
U=/home/claude/unified-wt
T=/home/claude/tools211
[ -f "$H" ] && [ -f "$PKG" ] || { echo "the built files are missing"; exit 1; }
grep -q "\"version\": \"$V\"" /home/claude/dist-unified/plugin/manifest.json || { echo "dist-unified is not $V"; exit 1; }
# 1. the shell's sources and tools into the repository; the round's own files (the plan, the sources gathered, the reviewers' reports,
#    the patches of the review round, the checks)
cp "$U"/unified/* "$R/unified/"
cp "$U/tools/build-unified.mjs" "$U/tools/publish-release.sh" "$U/tools/make-readme.py" "$R/tools/"
D="$R/tools/round-2.0.16"
mkdir -p "$D/checks" "$D/beit-sheni-tools"
cp "$T/PLAN.md" /home/claude/tools216/round_216.py /home/claude/tools216/publish_216.sh /home/claude/tools216/news.md /home/claude/tools214/solomon_214.py /home/claude/b2src/tools/rows_214.py "$D/"
cp /tmp/b2ykhold.mjs "$D/checks/"
# (the second house's sources are not in this repository; the steps this round changed are kept here for reference)
cp /home/claude/b2src/src/45-vessels.js /home/claude/b2src/src/50-heichal.js "$D/beit-sheni-tools/"
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
2.0.16 — בית שני 2.0.7: בהדגמת הכהן הגדול ביום הכיפורים שולחנות שלמה ומנורותיו מוסתרים (החלטת המשתמש, אפשרות ב); מלאכת שלמה והרש״ש בכרטיס השיטה. בית ראשון 1.4.7 כמו שהיה.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ERwCywgLN9329RVE5j6Sa5
MSGEOF
git push -q origin main
echo "main pushed: $(git rev-parse --short HEAD)"
