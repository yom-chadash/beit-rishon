#!/usr/bin/env python3
# the second house's part of WALK_STAIRS_306 (tools/round-3.0.6/walk_stairs.py), in the chain
import subprocess, sys, os
here = os.path.dirname(os.path.abspath(__file__))
sys.exit(subprocess.call([sys.executable, '-I', os.path.join(here, 'walk_stairs.py'), 'sheni-src/bundle.js', 'semis']))
