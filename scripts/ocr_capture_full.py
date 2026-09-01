# -*- coding: utf-8 -*-
"""Capture the FULL OCR text of every archived tooltip, once.

The first audit pass (ocr_gear_audit.py) stored only the parsed base stats, so
every new question - wrong class lists, missing equip bonuses, set lines, item
sources - has needed another 3.5-hour re-read. This stores the raw text, so all
of those become offline queries over one JSONL.

  python scripts/ocr_capture_full.py [--limit N]

Writes scripts/_ocr_text.jsonl: {rel, name, il, text}. Resumable.
"""
import argparse, io, json, os, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from ocr_gear_audit import index_screenshots  # same archive walk + skip rules

OUT = os.path.join(ROOT, 'scripts', '_ocr_text.jsonl')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    a = ap.parse_args()

    shots = index_screenshots()
    done = set()
    if os.path.exists(OUT):
        for line in io.open(OUT, encoding='utf-8'):
            try:
                done.add(json.loads(line)['rel'])
            except Exception:
                pass
    todo = [s for s in shots if s['rel'] not in done]
    if a.limit:
        todo = todo[:a.limit]
    print("indexed=%d done=%d this run=%d" % (len(shots), len(done), len(todo)))
    sys.stdout.flush()
    if not todo:
        return

    import easyocr, numpy as np
    from PIL import Image
    reader = easyocr.Reader(['en'], gpu=True, verbose=False)

    fh = io.open(OUT, 'a', encoding='utf-8')
    t0, errs = time.time(), 0
    for i, s in enumerate(todo, 1):
        rec = dict(rel=s['rel'], name=s['name'], il=s['il'])
        try:
            # PIL, not cv2: cv2.imread cannot open non-ASCII Windows paths
            img = np.array(Image.open(s['path']).convert('RGB'))
            rec['text'] = ' | '.join(reader.readtext(img, detail=0, paragraph=False))
        except Exception as e:
            rec['error'] = str(e)[:150]
            errs += 1
        fh.write(json.dumps(rec, ensure_ascii=False) + '\n')
        if i % 250 == 0:
            el = time.time() - t0
            print("  %d/%d  %.1f img/s  eta %.0f min  errors=%d"
                  % (i, len(todo), i / el, (len(todo) - i) / (i / el) / 60, errs))
            sys.stdout.flush()
            fh.flush()
    fh.close()
    print("DONE %d in %.0f min, %d errors" % (len(todo), (time.time() - t0) / 60, errs))


if __name__ == '__main__':
    main()
