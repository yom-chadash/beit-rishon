#!/bin/sh
# the content chain alone (no build), run once; then the cards are compared with the copy taken before: sh chaincheck.sh
# (after the review fixes the chain must be at rest: a run changes nothing)
cd /home/claude/b2src
cp tools/content.json /tmp/content_before_chain.json
for f in rows_191 rows_191b rows_192 rows_193 rows_194 rows_195 rows_196 rows_197 rows_198 rows_199 rows_200 tamid_rows_200 tamid_link_207 lots_link_207 cards_196 rows_208 cards_208 rows_210 rows_211 rows_211r; do
  [ -f tools/$f.py ] || continue
  python3 -I tools/$f.py >/dev/null || { echo "FAILED: $f"; exit 1; }
done
python3 -I - <<'PY'
import json
a=json.load(open('/tmp/content_before_chain.json',encoding='utf-8')); b=json.load(open('/home/claude/b2src/tools/content.json',encoding='utf-8'))
def flat(c):
    o={}
    for cat,items in c['PLACES']:
        for it in items: o['place '+it['t']]=json.dumps(it,ensure_ascii=False,sort_keys=True)
    for r in c['SHITOT']:
        o['rowmeta '+r['t']]=json.dumps({k:v for k,v in r.items() if k!='opts'},ensure_ascii=False,sort_keys=True)
        for x in r['opts']: o['row '+r['t']+' :: '+x['t']]=json.dumps(x,ensure_ascii=False,sort_keys=True)
    for k in ('VIEWS','INFO','REFS','CORRECTIONS','SHITOT_APPLIES','LABEL_MAP','NEWS'):
        v=c.get(k)
        if isinstance(v,dict):
            for kk,vv in v.items(): o[k+' '+str(kk)]=json.dumps(vv,ensure_ascii=False,sort_keys=True)
        else: o[k]=json.dumps(v,ensure_ascii=False,sort_keys=True)
    return o
fa,fb=flat(a),flat(b); n=0
for k in sorted(set(fa)|set(fb)):
    if fa.get(k)!=fb.get(k):
        n+=1
        x,y=fa.get(k) or '',fb.get(k) or ''
        i=0
        while i<min(len(x),len(y)) and x[i]==y[i]: i+=1
        print('CHANGED', k, '| at', i, '|', x[max(0,i-40):i+80].replace('\\n','¶'), '=>', y[max(0,i-40):i+80].replace('\\n','¶'))
print('chain at rest' if n==0 else ('changed cards: %d' % n))
PY
