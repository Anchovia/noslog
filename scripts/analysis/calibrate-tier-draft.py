#!/usr/bin/env python3
"""Offline provisional tier calibration. Reads JSON exports; never connects to a DB.
Requires NumPy. See generated methodology for explicit heuristic assumptions.
"""
import argparse, collections, hashlib, html, json, math, statistics
from pathlib import Path
import numpy as np

SLUGS = ['basic-s', 'basic-990k', 'basic-pianist', 'recital-pianist']
GOALS = {'basic-s': 950000, 'basic-990k': 990000, 'basic-pianist': 1000000}
SCALES = {'basic-s': 50000, 'basic-990k': 10000, 'basic-pianist': 1000}

def clamp(x, lo, hi):
    return max(lo, min(hi, float(x)))

def tenth(x):
    return math.floor(clamp(x, 1, 14.5) * 10 + 0.5) / 10

def loss(record, slug):
    if slug == 'recital-pianist':
        return -math.log(record['chart_recital_grd_raw'])
    deficit = 1000000 - record['score']
    if slug == 'basic-pianist':
        return math.log1p(deficit / 1000)
    return (math.log1p(max(0, GOALS[slug] - record['score']) / SCALES[slug])
            + .35 * math.log1p(deficit / SCALES[slug]))

def local_prediction(y, delta, weights):
    mask = weights > 1e-6
    if mask.sum() < 3:
        return None
    w, x, v = weights[mask], delta[mask], y[mask]
    neff = float(w.sum() ** 2 / np.square(w).sum())
    if neff < 3:
        return None
    # Local linear regression, with a small ridge only on the slope.
    design = np.column_stack((np.ones(len(x)), x))
    lhs = design.T @ (w[:, None] * design)
    lhs[1, 1] += w.sum() * .1
    coef = np.linalg.solve(lhs, design.T @ (w * v))
    spread = max(.15, math.sqrt(float(np.sum(w * (v - design @ coef) ** 2) / w.sum())))
    return float(coef[0]), spread, neff

def estimate_records(records, catalogue, slug):
    recital = slug == 'recital-pianist'
    grade_key = 'user_recital_grd_raw' if recital else 'user_basic_grd_raw'
    # Recital zero is missing, not failed. Basic zero is not a played score.
    valid = [r for r in records if r['chart_id'] in catalogue
             and (r['chart_recital_grd_raw'] > 0 if recital else r['score'] > 0)]
    users = np.array([r['analysis_user_no'] for r in valid])
    ids = np.array([r['chart_id'] for r in valid])
    constants = np.array([catalogue[r['chart_id']]['official_constant'] for r in valid], float)
    grades = np.array([(r[grade_key] or 0) / 100 for r in valid], float)
    difficulties = np.array([catalogue[r['chart_id']]['difficulty'] for r in valid])
    notes = np.array([catalogue[r['chart_id']]['note_count'] or 0 for r in valid], float)
    ys = np.array([loss(r, slug) for r in valid])
    result = collections.defaultdict(list)
    for i, r in enumerate(valid):
        delta = constants - constants[i]
        eligible = (ids != ids[i]) & (difficulties == difficulties[i]) & (np.abs(delta) <= 1.5)
        kernel = np.exp(-.5 * (delta / .75) ** 2) * eligible
        if recital:
            # Empirical note-count matching, NOT an assumed maximum-Recital formula.
            if notes[i] <= 0:
                continue
            ratio = np.log(np.maximum(notes, 1) / notes[i])
            kernel *= np.exp(-.5 * (ratio / .5) ** 2) * (notes > 0)
        own = local_prediction(ys, delta, kernel * (users == users[i]))
        sigma = 1000 if recital else 400  # Display Grd units; explicit heuristic.
        other_weights = kernel * np.exp(-.5 * ((grades - grades[i]) / sigma) ** 2) * (users != users[i])
        # Each comparison user's total weight is capped at one to avoid prolific-user dominance.
        for u in np.unique(users):
            mask = users == u
            other_weights[mask] /= max(1, float(other_weights[mask].sum()))
        other = local_prediction(ys, delta, other_weights)
        if own is None and other is None:
            continue
        if own is not None and other is not None:
            alpha = own[2] / (own[2] + 12)
            expected = alpha * own[0] + (1-alpha) * other[0]
            spread = alpha * own[1] + (1-alpha) * other[1]
        else:
            expected, spread, _ = own or other
        # Half a tier unit per local SD, capped to one unit before shrinkage.
        adjustment = clamp(.5 * (ys[i] - expected) / spread, -1, 1)
        result[r['chart_id']].append((int(users[i]), adjustment))
    return result, valid

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--placements', required=True)
    ap.add_argument('--records', required=True)
    ap.add_argument('--catalogue', required=True)
    ap.add_argument('--output', required=True)
    args = ap.parse_args()
    paths = {k: Path(getattr(args, k)) for k in ('placements', 'records', 'catalogue')}
    data = {k: json.loads(p.read_text()) for k, p in paths.items()}
    placements, records = data['placements'], data['records']
    cat = {r['chart_id']: r for r in data['catalogue']}
    assert len(cat) == len(data['catalogue'])
    assert len(records) == len({(r['analysis_user_no'], r['chart_id']) for r in records})
    assert all(r['chart_id'] in cat and 0 <= r['score'] <= 1000000 for r in records)
    assert all(c['official_constant'] is not None for c in cat.values())
    old = {(r['slug'], r['chart_id']): r for r in placements}
    target_ids = sorted(cid for cid, c in cat.items() if c['difficulty'] in ('Hard', 'Expert', 'Real'))
    out = Path(args.output); out.mkdir(parents=True, exist_ok=True)
    proposals = []
    summary = {}
    for slug in SLUGS:
        effects, valid = estimate_records(records, cat, slug)
        by_chart = collections.defaultdict(list)
        for r in valid:
            by_chart[r['chart_id']].append(r)
        anchors = [r for r in placements if r['slug'] == slug and r['history_count'] > 1]
        for cid in target_ids:
            c = cat[cid]; prior = float(c['official_constant']); previous = old.get((slug, cid))
            manual = previous is not None and previous['history_count'] > 1
            # Only smooth anchor offsets with >=5 nearby anchors of the same difficulty.
            nearby = [a for a in anchors if a['difficulty'] == c['difficulty']
                      and abs(a['official_constant'] - prior) <= 1]
            anchor_offset = 0.
            if len(nearby) >= 5:
                offset = statistics.median(a['current_tier'] - a['official_constant'] for a in nearby)
                anchor_offset = clamp(offset * len(nearby) / (len(nearby) + 8), -1.2, 1.2)
            ev = effects.get(cid, [])
            peer_offsets = [statistics.median(v for _, v in vals)
                            for other_id, vals in effects.items()
                            if other_id != cid and len(vals) >= 3
                            and cat[other_id]['difficulty'] == c['difficulty']
                            and abs(cat[other_id]['official_constant'] - prior) <= .5]
            fallback = statistics.median(peer_offsets) * len(peer_offsets) / (len(peer_offsets)+10) if peer_offsets else 0.
            n = len(ev)
            observed = statistics.median(v for _, v in ev) if ev else 0.
            adjustment = n/(n+3) * observed + 3/(n+3) * fallback
            modeled = tenth(prior + anchor_offset + adjustment)
            proposed = previous['current_tier'] if manual else modeled
            samples = by_chart[cid]
            success = sum(r['score'] >= GOALS[slug] or (slug == 'basic-pianist' and r['fc_type'] == 3)
                          for r in samples) if slug != 'recital-pianist' else None
            source = '수동 배치 유지' if manual else ('관측 보정' if n >= 3 else '소표본 보정' if n else '유사 채보·공식 상수 보정')
            loo = []
            if n >= 2:
                for u, _ in ev:
                    remaining = [v for other_u, v in ev if other_u != u]
                    correction = len(remaining)/(len(remaining)+3) * statistics.median(remaining) + 3/(len(remaining)+3) * fallback
                    loo.append(tenth(prior + anchor_offset + correction))
            proposals.append(dict(slug=slug, chart_id=cid, title=c['title'], difficulty=c['difficulty'],
                official_constant=prior, current_tier=previous['current_tier'] if previous else None,
                proposed_tier=proposed, model_tier=modeled, source=source, users=len(samples),
                comparable_users=n, successes=success, anchor_count=len(nearby),
                anchor_offset=round(anchor_offset,4), record_adjustment=round(adjustment,4),
                sensitivity_min=min(loo) if loo else None, sensitivity_max=max(loo) if loo else None,
                at_ceiling=proposed==14.5))
        group = [p for p in proposals if p['slug']==slug]
        summary[slug] = dict(total=len(group), changed=sum(p['current_tier'] is not None and p['current_tier']!=p['proposed_tier'] for p in group),
            new=sum(p['current_tier'] is None for p in group), sources=dict(collections.Counter(p['source'] for p in group)),
            no_record=sum(p['users']==0 for p in group), ceiling=sum(p['at_ceiling'] for p in group))
        print(slug, json.dumps(summary[slug],ensure_ascii=False), flush=True)
    assert len(proposals) == len(target_ids)*4
    assert all(1 <= p['proposed_tier'] <= 14.5 for p in proposals)
    assert all(abs(p['proposed_tier']*10-round(p['proposed_tier']*10))<1e-8 for p in proposals)
    assert all(p['proposed_tier']==p['current_tier'] for p in proposals if p['source']=='수동 배치 유지')
    metadata = {'catalogue_charts':len(cat), 'target_charts':len(target_ids), 'users':len({r['analysis_user_no'] for r in records}),
        'records':len(records),'input_sha256':{k:hashlib.sha256(p.read_bytes()).hexdigest() for k,p in paths.items()},'summary':summary}
    (out/'proposals.json').write_text(json.dumps(proposals,ensure_ascii=False,indent=2)+'\n')
    (out/'summary.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    # Standalone review artifact. TextContent only for dynamic user-supplied strings.
    columns=['slug','title','difficulty','official_constant','current_tier','proposed_tier','model_tier','source','users','successes','comparable_users','sensitivity_min','sensitivity_max']
    labels=['서열표','악곡','난이도','공식','현재','제안','모델 참고값','근거','기록 인원','달성 인원','비교 가능 인원','민감도 하한','민감도 상한']
    payload=json.dumps(proposals,ensure_ascii=False).replace('<','\\u003c')
    page='''<!doctype html><meta charset="utf-8"><title>서열 상수 1차 초안</title>
<style>body{font:14px system-ui;margin:24px;background:#111;color:#dbdbdb}input,select,button{font:inherit;padding:8px;background:#222;color:inherit;border:1px solid #717171}table{border-collapse:collapse;width:100%;margin-top:16px}td,th{padding:8px;text-align:left;border-bottom:1px solid #393939}th{position:sticky;top:0;background:#222}p{max-width:1000px;line-height:1.6}</style>
<h1>서열 상수 1차 초안</h1><p>7명 기록에 기반한 임시 추정입니다. Normal은 유지합니다. 수동 배치 98개는 유지하며 모델 참고값은 적용하지 않습니다. 관측 보정도 검증된 확정값이 아닙니다. 민감도 범위는 한 명의 보정값을 제외했을 때의 변화이며 신뢰구간이 아닙니다. Recital은 최고 Grd의 상대적 낮음을 비교한 대용 지표입니다.</p>
<input id="q" placeholder="악곡명 검색"><select id="scope"><option value="">모든 서열표</option>'''+''.join('<option>'+s+'</option>' for s in SLUGS)+'''</select> <label><input type="checkbox" id="changed">변경·신규만</label><p id="count"></p><table><thead><tr>'''+''.join('<th>'+html.escape(x)+'</th>' for x in labels)+'''</tr></thead><tbody id="rows"></tbody></table><script>
const data='''+payload+'''; const columns='''+json.dumps(columns)+''';
function render(){let filtered=data.filter(r=>(!scope.value||r.slug===scope.value)&&r.title.toLowerCase().includes(q.value.toLowerCase())&&(!changed.checked||r.current_tier!==r.proposed_tier));document.getElementById('count').textContent=filtered.length+'개';const frag=document.createDocumentFragment();for(const row of filtered){const tr=document.createElement('tr');for(const key of columns){const td=document.createElement('td');td.textContent=row[key]??'—';tr.append(td)}frag.append(tr)}document.getElementById('rows').replaceChildren(frag)}
for(const id of ['q','scope','changed'])document.getElementById(id).addEventListener('input',render);render();</script>'''
    (out/'review.html').write_text(page)
    # Rating impact uses the exact current top-70 square/mastery formula.
    new_values={(p['slug'],p['chart_id']):p['proposed_tier'] for p in proposals}
    impacts=[]
    def mastery(score):
        points=[(950000,.15),(960000,.23),(970000,.34),(980000,.5),(990000,.72),(1000000,1.)]
        if score<950000:return 0.
        for (a,b),(c,d) in zip(points,points[1:]):
            if score<=c:return b+(d-b)*(score-a)/(c-a)
        return 1.
    for slug in ['basic-pianist','recital-pianist']:
        before={r['chart_id']:r['current_tier'] for r in placements if r['slug']==slug}
        after=before|{cid:v for (s,cid),v in new_values.items() if s==slug}
        def rating(user,constants):
            denom=sum(sorted((v*v for v in constants.values()),reverse=True)[:70])
            points=[constants[r['chart_id']]**2*mastery(r['score']) for r in records if r['analysis_user_no']==user
                    and r['chart_id'] in constants and (slug!='recital-pianist' or r['chart_recital_grd_raw']>0)]
            return min(10000,sum(sorted(points,reverse=True)[:70])/denom*10000)
        for u in sorted({r['analysis_user_no'] for r in records}):
            a,b=rating(u,before),rating(u,after)
            impacts.append({'mode':slug.split('-')[0],'analysis_user_no':u,'before':round(a,2),'after':round(b,2),'delta':round(b-a,2)})
    (out/'rating-impact.json').write_text(json.dumps(impacts,ensure_ascii=False,indent=2)+'\n')
    print('rating impact',impacts,flush=True)

if __name__=='__main__':
    main()
