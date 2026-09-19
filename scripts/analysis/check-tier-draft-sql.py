#!/usr/bin/env python3
"""Integration-check generated SQL in a disposable, socket-only local PostgreSQL.
Never loads .env or accepts a remote database connection.
"""
import argparse,json,os,shutil,subprocess,tempfile
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--placements',required=True); ap.add_argument('--catalogue',required=True); ap.add_argument('--output',required=True); args=ap.parse_args()
    out=Path(args.output); old=json.loads(Path(args.placements).read_text()); cat=json.loads(Path(args.catalogue).read_text())
    root=Path(tempfile.mkdtemp(prefix='noslog-tier-check-',dir='/tmp')); pg=root/'pg'; sock=root/'sock'; sock.mkdir()
    binary=Path('/opt/homebrew/bin'); env=os.environ.copy()
    for key in list(env):
        if key.startswith('PG') or key in ('DATABASE_URL','DIRECT_URL'):env.pop(key,None)
    def run(cmd,**kwargs):return subprocess.run(cmd,env=env,text=True,capture_output=True,**kwargs)
    def sql(text,success=True):
        r=run([str(binary/'psql'),'-X','-v','ON_ERROR_STOP=1','-h',str(sock),'-d','postgres','-At'],input=text)
        if success and r.returncode:raise AssertionError(r.stderr[-5000:])
        if not success and not r.returncode:raise AssertionError('Expected SQL to reject, but succeeded')
        return r.stdout if success else r.stderr
    def q(x):return 'NULL' if x is None else "'"+str(x).replace("'","''")+"'"
    started=False
    try:
        r=run([str(binary/'initdb'),'-D',str(pg),'-A','trust','--no-locale','-E','UTF8']); assert r.returncode==0,r.stderr
        r=run([str(binary/'pg_ctl'),'-D',str(pg),'-l',str(root/'server.log'),'-o',f"-k {sock} -h ''",'-w','start']); assert r.returncode==0,r.stderr; started=True
        schema='''CREATE TABLE "MusicChart"(id integer PRIMARY KEY,difficulty text NOT NULL,level_constant double precision,note_count integer);
CREATE TABLE "TierList"(id integer PRIMARY KEY,slug text UNIQUE NOT NULL,mode text NOT NULL,goal text,status text NOT NULL,created_at timestamp NOT NULL DEFAULT now(),updated_at timestamp NOT NULL DEFAULT now());
CREATE TABLE "TierBand"(id integer PRIMARY KEY,value double precision NOT NULL,position integer NOT NULL,tier_list_id integer NOT NULL REFERENCES "TierList",UNIQUE(tier_list_id,value),UNIQUE(tier_list_id,position));
CREATE TABLE "TierEntry"(id serial PRIMARY KEY,position integer NOT NULL,tier_list_id integer NOT NULL REFERENCES "TierList",tier_band_id integer NOT NULL REFERENCES "TierBand",chart_id integer NOT NULL REFERENCES "MusicChart",created_at timestamp NOT NULL DEFAULT now(),updated_at timestamp NOT NULL,UNIQUE(tier_list_id,chart_id),UNIQUE(tier_band_id,position));
CREATE TABLE "TierPlacementHistory"(id serial PRIMARY KEY,band_value double precision,effective_at timestamp NOT NULL DEFAULT now(),tier_list_id integer NOT NULL REFERENCES "TierList",chart_id integer NOT NULL REFERENCES "MusicChart",created_at timestamp NOT NULL DEFAULT now());
CREATE INDEX history_lookup ON "TierPlacementHistory"(tier_list_id,chart_id,effective_at);
'''
        schema+='INSERT INTO "MusicChart" VALUES '+','.join(f"({c['chart_id']},{q(c['difficulty'])},{c['official_constant']},{q(c['note_count'])})" for c in cat)+';\n'
        lists={r['tier_list_id']:r for r in old}
        schema+='INSERT INTO "TierList"(id,slug,mode,goal,status) VALUES '+','.join(f"({i},{q(r['slug'])},{q(r['mode'])},{q(r['goal'])},'published')" for i,r in lists.items())+';\n'
        schema+='INSERT INTO "TierBand" VALUES '+','.join(f"({i*1000+unit},{unit/10},{146-unit},{i})" for i in lists for unit in range(10,146))+';\n'
        pos={}; entryrows=[]; historyrows=[]
        for r in old:
            band=r['tier_list_id']*1000+round(r['current_tier']*10); pos[band]=pos.get(band,0)+1
            entryrows.append(f"({r['entry_id']},{pos[band]},{r['tier_list_id']},{band},{r['chart_id']},{q(r['entry_created_at'])},{q(r['entry_updated_at'])})")
            for n in range(r['history_count']):
                when=r['first_history_at'] if n==0 else r['last_history_at']
                historyrows.append(f"({r['current_tier']},{q(when)},{r['tier_list_id']},{r['chart_id']},{q(when)})")
        schema+='INSERT INTO "TierEntry" VALUES '+','.join(entryrows)+';\n'
        schema+='INSERT INTO "TierPlacementHistory"(band_value,effective_at,tier_list_id,chart_id,created_at) VALUES '+','.join(historyrows)+';\n'
        schema+='SELECT setval(pg_get_serial_sequence(\'"TierEntry"\',\'id\'),(SELECT MAX(id) FROM "TierEntry"));'
        sql(schema)
        print('fixture loaded',len(old),'placements',len(cat),'charts',flush=True)
        def fingerprint():
            return sql(' UNION ALL '.join(f'''SELECT md5(jsonb_agg(to_jsonb(t) ORDER BY id)::text) FROM "{name}" t''' for name in ['TierList','TierBand','TierEntry','TierPlacementHistory'])+';').strip()
        original=fingerprint()
        sql('UPDATE "TierEntry" SET updated_at=updated_at+interval \'1 second\' WHERE id=(SELECT MIN(id) FROM "TierEntry");')
        err=sql((out/'02-apply.sql').read_text(),False); assert '현재 배치가' in err,err
        sql('UPDATE "TierEntry" SET updated_at=updated_at-interval \'1 second\' WHERE id=(SELECT MIN(id) FROM "TierEntry");')
        assert fingerprint()==original
        print('stale snapshot rejected without writes',flush=True)
        sql('INSERT INTO "MusicChart" VALUES(999999,\'Expert\',12,1000);')
        err=sql((out/'02-apply.sql').read_text(),False); assert '전체 채보' in err,err
        sql('DELETE FROM "MusicChart" WHERE id=999999;')
        print('new catalogue chart rejected',flush=True)
        print('preview',sql((out/'01-preview.sql').read_text()).strip(),flush=True)
        print('apply',sql((out/'02-apply.sql').read_text())[-800:],flush=True)
        applied=fingerprint()
        assert applied!=original
        verification=sql((out/'03-verify.sql').read_text()); assert verification.splitlines()[0]=='0',verification
        props=json.loads((out/'proposals.json').read_text())
        got=sql('SELECT t.slug,e.chart_id,b.value FROM "TierEntry" e JOIN "TierList" t ON t.id=e.tier_list_id JOIN "TierBand" b ON b.id=e.tier_band_id ORDER BY t.slug,e.chart_id;')
        observed={(s,int(c)):float(v) for s,c,v in (line.split('|') for line in got.splitlines())}
        assert all(observed[(p['slug'],p['chart_id'])]==p['proposed_tier'] for p in props)
        assert sql('SELECT COUNT(*) FROM "TierEntry" WHERE position<=0;').strip()=='0'
        print('all 6364 values and positive positions verified',flush=True)
        sql((out/'02-apply.sql').read_text(),False); assert fingerprint()==applied
        print('reapply rejected without writes',flush=True)
        sql('UPDATE "TierPlacementHistory" SET effective_at=effective_at+interval \'1 second\' WHERE id=(SELECT MAX(id) FROM "TierPlacementHistory");')
        err=sql((out/'04-rollback.sql').read_text(),False); assert '후속 변경' in err,err
        sql('UPDATE "TierPlacementHistory" SET effective_at=effective_at-interval \'1 second\' WHERE id=(SELECT MAX(id) FROM "TierPlacementHistory");')
        assert fingerprint()==applied
        print('rollback after intervening edit rejected',flush=True)
        sql((out/'04-rollback.sql').read_text()); assert fingerprint()==original
        print('rollback restores exact entries, positions, timestamps, lists, histories',flush=True)
        sql((out/'04-rollback.sql').read_text(),False); assert fingerprint()==original
        print('double rollback rejected; PASS',flush=True)
    finally:
        if started:
            stopped=run([str(binary/'pg_ctl'),'-D',str(pg),'-m','fast','-w','stop'])
            if stopped.returncode:raise RuntimeError('Temporary PostgreSQL stop failed: '+stopped.stderr)
        shutil.rmtree(root)
if __name__=='__main__':main()
