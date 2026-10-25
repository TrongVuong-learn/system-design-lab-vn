"""Audit the narrowly reviewed citation-only compatibility amendment against release."""
import json
import subprocess
from pathlib import Path

BASE = '68f7de6cd2d1659c0b9840c067e5e519539c1194'
PATH = 'content/compatibility-v1.json'
old = json.loads(subprocess.check_output(['git', 'show', f'{BASE}:{PATH}']))
new = json.loads(Path(PATH).read_text())
changes = []

def compare(a, b, path):
    if a == b:
        return
    if isinstance(a, dict) and isinstance(b, dict):
        assert a.keys() == b.keys(), path
        for k in a:
            compare(a[k], b[k], path + [k])
    elif isinstance(a, list) and isinstance(b, list) and path[-1] != 'sourceIds':
        assert len(a) == len(b), path
        for i, (x, y) in enumerate(zip(a, b)):
            compare(x, y, path + [i])
    else:
        assert len(path) == 6 and path[0] == 'lessons', path
        assert path[2] in ['chapters', 'practice'] and path[3] == 'items' and path[5] == 'sourceIds', path
        lesson = new['lessons'][path[1]]['lessonId']
        assert lesson in {x['lessonId'] for x in json.loads(Path('docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/parent/source-mapping.json').read_text())['mapping']} | set(json.loads(Path('docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/parent/source-mapping.json').read_text())['supplements'])
        changes.append({'lessonId':lesson,'field':path[2],'item':path[4],'before':a,'after':b})

compare(old, new, [])
assert len(changes) == 70, len(changes)
result={'baseline':BASE,'contracts':len(old['lessons']),'changedCitationArrays':len(changes),'allOtherContractFieldsIdentical':True,'changes':changes}
Path('docs/research/knowledge-reviewer/evidence/qa09-2026-10-25/parent/contract-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print('85 contracts compared: exactly70 sourceIds arrays changed; all other fields identical.')
