import json
import re
import os

home = os.path.split(os.path.realpath(__file__))[0]
j = ''
m = {}
with open(os.path.join(home, 'synonyms_original.json')) as f:
    j = json.load(f)
for k in j.keys():
    if ' 'in k:
        continue
    word = k.split(':')[0]
    if word not in m.keys():
        m[word] = set()
    ws = re.split(r';|\|', j[k])
    for w in ws:
        if ' ' not in w:
            m[word].add(w)
ret = {}
for k in m.keys():
    if len(m[k]) != 0:
        ret[k] = list(m[k])
with open(os.path.join(home, 'synonyms.json'), 'w') as f:
    json.dump(ret, f)
