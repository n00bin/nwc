"""ONE-TIME seed for data/achievements-dungeons.json (the Dungeon Achievement Tracker catalog).

  python -I scripts/seed-achievements-catalog.py <achievements_raw.json> [--force]

Source: the owner's in-game screenshot read of 2026-10-14. Those entries are only
the achievements he had NOT finished, so every sub-item name that is not itself
one of them is added as a `catalog_only` entry (points unknown = 0).

After this runs once, data/achievements-dungeons.json is the source of truth:
edit it by hand (or re-seed from a fuller "Show All" screenshot read). The script
refuses to overwrite an existing catalog unless --force is given.

Personal state is stripped: no ticks, no counter values, no "(3/5)" text.
"""
import difflib, io, json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'data', 'achievements-dungeons.json')


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = s.lower().replace("'", '').replace('\u2019', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def key(s):
    """Loose match key: ignores case, punctuation, 'the', and the (Master) tag."""
    s = re.sub(r'\(\s*mast\w*\)?', ' ', s.lower())
    s = s.replace("'", '').replace('\u2019', '')
    s = re.sub(r'[^a-z0-9 ]+', ' ', s)
    return ' '.join(w for w in s.split() if w not in ('the', 'master'))


def fix_name(n):
    n = n.strip()
    n = re.sub(r'\(\s*(?:mast|master)\s*$', '(Master)', n, flags=re.I)   # clipped by the UI edge
    n = re.sub(r'\(MASTER\)', '(Master)', n)
    n = n.replace('D\u00e9j\u00e0', 'D\u00e9j\u00e0')
    return n


DUNGEON_FIX = {
    'not stated in text': 'Other',
    'orcus': "Orcus's Chamber",
    "orcus's chamber": "Orcus's Chamber",
    'queen of air and darkness encounter': 'Queen of Air and Darkness',
}


PREFIXED = re.compile(r'^(Dash|Perfection|Minimalist):\s*(?:the\s+)?(.*?)\s*(\(Master\))?$', re.I)


def canon_name(n, master):
    """One spelling per achievement: 'Dash: <Dungeon> (Master)', no 'the', so the
    same dungeon never appears as two near-duplicates."""
    m = PREFIXED.match(n)
    if m:
        base = m.group(2)
        base = base[0].upper() + base[1:] if base else base
        return '%s: %s%s' % (m.group(1).capitalize(), base, ' (Master)' if (master or m.group(3)) else '')
    if re.match(r'^the\s+.+\(master\)$', n, re.I):      # 'The Imperial Citadel (Master)'
        return n[4:]
    return n


# Hardcore / dungeon-completion sub-items -> their own dungeon (matched on key()).
DUNGEON_ALIASES = [
    ('cloak tower', 'Cloak Tower'), ('cragmire crypts', 'Cragmire Crypts'),
    ('gray wolf den', 'Gray Wolf Den'), ('pirate kings retreat', "Pirate King's Retreat"),
    ('frozen heart', "Icespire's Frozen Heart"), ('spellplague cavern', 'Spellplague Caverns'),
    ('cavern karrundax', 'Caverns of Karrundax'), ('kessells run', "Kessell's Retreat"),
    ('shore of tuern', 'Shore of Tuern'), ('malabogs castle', "Malabog's Castle"),
    ('valindras tower', "Valindra's Tower"), ('lair of lostmauth', 'Lair of Lostmauth'),
    ('castle never', 'Castle Never'), ('fangbreaker island', 'Fangbreaker Island'),
    ('tomb of nine gods', 'Tomb of the Nine Gods'), ('castle ravenloft', 'Castle Ravenloft'),
    ('temple of spider', 'Temple of the Spider'),
]


def clean_dungeon(d):
    base = re.sub(r'\s*\(.*?\)\s*', ' ', d or '').strip()
    base = DUNGEON_FIX.get(base.lower(), base)
    return base or 'Other'


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    if os.path.exists(OUT) and '--force' not in sys.argv:
        sys.exit('catalog already exists; the JSON is now the source of truth. Use --force to re-seed.')
    raw = json.load(io.open(sys.argv[1], encoding='utf-8'))
    src = raw['achievements']

    entries, by_key = [], {}
    for a in src:
        name = fix_name(a['name'])
        master = bool(a.get('master')) or '(master)' in name.lower()
        orig_name = name
        name = canon_name(name, master)
        desc = (a.get('description') or '').strip()
        counters = []
        m = re.search(r'\s*\((\d+)\s*/\s*(\d+)\)\s*$', desc)
        if m:
            desc = desc[:m.start()].rstrip()
            counters.append({'id': 'progress', 'label': 'Progress', 'need': int(m.group(2))})
        e = {'id': slug(name), 'name': name, 'points': int(a.get('points') or 0), 'master': master,
             'dungeon': clean_dungeon(a.get('dungeon')), 'dungeon_full': a.get('dungeon') or '',
             'description': desc, 'subs': [], 'counters': counters, 'notes': ''}
        # ids must never change once shipped; renames list the old id so saved progress migrates
        e['aliases'] = [slug(orig_name)] if slug(orig_name) != e['id'] else []
        entries.append(e)
        by_key[key(name)] = e
    ids = [e['id'] for e in entries]
    assert len(ids) == len(set(ids)), 'duplicate ids'

    known_dungeons = sorted({e['dungeon'] for e in entries if e['dungeon'] not in ('General', 'Other')},
                            key=lambda d: -len(d))

    def find(text):
        k = key(text)
        if k in by_key:
            return by_key[k]
        close = difflib.get_close_matches(k, list(by_key), n=1, cutoff=0.92)
        return by_key[close[0]] if close else None

    log_fuzzy, added = [], {}
    for a, e in zip(src, entries):
        for s in a.get('sub_items') or []:
            s = s.strip()
            if s.lower().startswith('grants title:'):
                e['reward'] = 'Title: ' + s.split(':', 1)[1].strip()
                continue
            mc = re.match(r'^(.*?)\s*\((\d+)\s*/\s*(\d+)\)$', s)
            if mc:   # "Defeat X (2/5)" is a counter, not an achievement
                label = mc.group(1).strip()
                e['counters'].append({'id': slug(label), 'label': label, 'need': int(mc.group(3))})
                continue
            tgt = find(s)
            if tgt is None:
                k = key(s)
                if k not in added:
                    dk = key(s)
                    dg = next((d for n, d in DUNGEON_ALIASES if n in dk), None) or                          next((d for d in known_dungeons if key(d) in dk), None)
                    nm = canon_name(s, '(master)' in s.lower())
                    added[k] = {'id': slug(nm), 'aliases': [slug(s)] if slug(s) != slug(nm) else [], 'name': nm, 'points': 0, 'master': '(master)' in s.lower(),
                                'dungeon': dg or e['dungeon'],
                                'dungeon_full': (dg or e['dungeon_full']), 'description': '',
                                'subs': [], 'counters': [], 'notes': '', 'catalog_only': True}
                tgt = added[k]
            elif key(tgt['name']) != key(s) or tgt['name'] != s:
                if tgt['name'].lower() != s.lower():
                    log_fuzzy.append((s, tgt['name']))
            e['subs'].append({'text': tgt['name'], 'ref': tgt['id']})

    catalog_only = list(added.values())
    allids = [x['id'] for x in entries + catalog_only]
    assert len(allids) == len(set(allids)), 'duplicate ids after catalog-only: %r' % [i for i in allids if allids.count(i) > 1]
    out = {'version': 1, 'built': '2026-10-14',
           'source': "Owner's in-game screenshots, 2026-10-14 (unfinished achievements only). Entries with "
                     "catalog_only=true were found only as sub-items; points unknown (0).",
           'achievements': entries + catalog_only}
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
    print('open entries:', len(entries), ' catalog-only:', len(catalog_only), ' total:', len(entries) + len(catalog_only))
    print('sub matches that were not exact (check these):')
    for s, n in log_fuzzy:
        print('   %r -> %r' % (s, n))


main()
