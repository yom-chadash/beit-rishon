# -*- coding: utf-8 -*-
# tools/share-gen/cut_frag.py - a piece of a module of each house into ONE shared fragment (21.11.2026, stage 2 of the split; used once
# per piece, for the figures' kits). The piece's lines in each house's module become one line "<indent>//@@include <name>", the piece
# goes through tools/share-gen/share_gen.py into shared/frag/<name>.js and the slots src/slots/<name>.slots.js,
# sheni/src/slots/<name>.slots.js; tools/house-slots.mjs puts it back at build time, byte for byte (checked here before writing).
#
#   python3 -I tools/share-gen/cut_frag.py <name> <rishon module> <first line> <last line> <sheni module> <first line> <last line>
#   (lines 1-based and inclusive; the modules' paths from the repository's root, e.g. src/30-courts.js sheni/src/30-courts.js)
#
# Used on 21.11.2026 (the lines of 3.0.6):
#   people-kit  src/30-courts.js 200 641   sheni/src/30-courts.js 2 554     ("===== PEOPLE_KIT_204 BEGIN" ... "===== PEOPLE_KIT_204 END")
#   priest-kit  src/58-ark.js 12 370       sheni/src/55-payis.js 33 394     (PAYIS_FIGURE4: from "const mat = (color, extra)" to the
#                                                                            line before ark_kit's return / SH.priestKit)
import sys, os, subprocess, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
name, rf, r0, r1, sf, s0, s1 = sys.argv[1:8]
r0, r1, s0, s1 = int(r0), int(r1), int(s0), int(s1)
R = open(os.path.join(ROOT, rf), encoding='utf-8').read().split('\n')
S = open(os.path.join(ROOT, sf), encoding='utf-8').read().split('\n')
tmp = tempfile.mkdtemp()
open(os.path.join(tmp, 'r.js'), 'w', encoding='utf-8').write('\n'.join(R[r0 - 1:r1]))
open(os.path.join(tmp, 's.js'), 'w', encoding='utf-8').write('\n'.join(S[s0 - 1:s1]))
frag = os.path.join(ROOT, 'shared', 'frag', name + '.js')
if os.path.exists(frag): sys.exit('shared/frag/' + name + '.js exists already')
subprocess.check_call(['python3', '-I', os.path.join(HERE, 'share_gen.py'), os.path.join(tmp, 'r.js'), os.path.join(tmp, 's.js'), frag,
                       os.path.join(ROOT, 'src', 'slots', name + '.slots.js'), os.path.join(ROOT, 'sheni', 'src', 'slots', name + '.slots.js')])
ind = lambda L, i: L[i][:len(L[i]) - len(L[i].lstrip())]
open(os.path.join(ROOT, rf), 'w', encoding='utf-8').write('\n'.join(R[:r0 - 1] + [ind(R, r0 - 1) + '//@@include ' + name] + R[r1:]))
open(os.path.join(ROOT, sf), 'w', encoding='utf-8').write('\n'.join(S[:s0 - 1] + [ind(S, s0 - 1) + '//@@include ' + name] + S[s1:]))
# the proof: each house's module, with the piece put back, is the module as it was
for house, f, L in (('rishon', rf, R), ('sheni', sf, S)):
    got = subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'house-slots.mjs'), house, os.path.basename(f)]).decode('utf-8')
    if got != '\n'.join(L):
        sys.exit(f + ': the piece does not come back byte for byte - restore the file from git')
print(name + ': ' + rf + ' ' + str(r0) + '-' + str(r1) + ', ' + sf + ' ' + str(s0) + '-' + str(s1) + ' -> shared/frag/' + name + '.js (both modules come back byte for byte)')
