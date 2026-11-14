#!/bin/sh
# 2.0.10 - the publishing, in the order of unified/DEV_NOTES.md "סדר הפרסום": the branch html first, then main (the store), then the
# GitHub release and README.md (written anew).
set -e
V=2.0.10; V1=1.4.3; V2=2.0.1; DATE=14.11.2026
H="/home/claude/dist-unified/בית המקדש - לצפייה בלי אוצריא - גרסה $V.html"
PKG="/home/claude/dist-unified/בית-המקדש-$V.otzplugin"
NEWS=/home/claude/tools210/news.md
R=/home/claude/beit-rishon
U=/home/claude/unified-wt
[ -f "$H" ] && [ -f "$PKG" ] || { echo "the built files are missing"; exit 1; }
grep -q "\"version\": \"$V\"" /home/claude/dist-unified/plugin/manifest.json || { echo "dist-unified is not $V"; exit 1; }
# 1. the shell's sources and tools into the repository
cp "$U"/unified/* "$R/unified/"
cp "$U/tools/build-unified.mjs" "$U/tools/publish-release.sh" "$U/tools/make-readme.py" "$R/tools/"
mkdir -p "$R/tools/round-2.0.10/checks"
cp /home/claude/tools210/round_210.py /home/claude/tools210/publish_210.sh /home/claude/tools210/news.md "$R/tools/round-2.0.10/"
cp /home/claude/tools210/checks/final12.sh "$R/tools/round-2.0.10/checks/"
# 2. the branch html (before main)
cd "$R" && sh tools/publish-release.sh html "$V" "$H"
# 3. the folder the store publishes from
python3 -I - <<'EOF'
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
EOF
# 4. README.md, anew
python3 -I tools/make-readme.py "$V" "$V1" "$V2" "$DATE" "$NEWS" README.md
# 5. main
git add -A
git commit -q -F - <<EOF
2.0.10 — בית ראשון 1.4.3 + בית שני 2.0.1: לשכות מלאות, שמות לשכות בית המוקד לפי משנת תמיד, שלחן החלבים, תיקוני סקירה חיצונית, הורדה ושמירה בקובץ ה־HTML

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01ERwCywgLN9329RVE5j6Sa5
EOF
git push -q origin main
echo "main pushed: $(git rev-parse --short HEAD)"
