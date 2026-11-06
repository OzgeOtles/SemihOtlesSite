"""Read and validate Sheet1 of the supplied XLSX without modifying it."""
import sys, json, hashlib
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.local-tools'))
import zipfile
import xml.etree.ElementTree as ET

source = Path(sys.argv[1])
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(source) as z:
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    sheet_entry = next(s for s in wb.findall('s:sheets/s:sheet', ns) if s.get('name') == 'Sheet1')
    rid = sheet_entry.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
    rel = next(r for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels')) if r.get('Id') == rid)
    target = rel.get('Target')
    path = target.lstrip('/') if target.startswith('/') else 'xl/'+target
    cells = ET.fromstring(z.read(path)).findall('.//s:sheetData/s:row/s:c', ns)
    raw = {}
    for c in cells:
        v = c.find('s:v', ns)
        if c.get('t') not in ('s','str','e') and v is not None and v.text:
            n = float(v.text)
            assert n >= 0 and n.is_integer(), c.get('r')
            raw[c.get('r')] = int(n)
columns = [chr(c) for c in range(65,91)] + ['AA','AB','AC','AD','AE']
class Sheet:
    name = 'Sheet1'
    def row_values(self, i):
        return [raw.get(c+str(i+1)) for c in columns]
sheet = Sheet()
rows = []
for i in range(5, 48):
    values = sheet.row_values(i)
    rows.append({'year': int(values[0]), 'sourceRow': i+1,
                 'values': [int(v) if isinstance(v, (int,float)) else None for v in values[1:]]})
assert len({r['year'] for r in rows}) == len(rows), 'Duplicate years'
data = {'source': source.name, 'sheet': sheet.name, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'rows': rows, 'reportedTotals': [int(v) if isinstance(v,(int,float)) else None for v in sheet.row_values(48)[1:]]}
for row in rows:
    v = row['values']
    if any(n is not None for n in v[:26]):
        assert sum(n or 0 for n in v[:26]) == v[29], row['year']
        assert sum(n or 0 for n in v[26:29]) == v[29], row['year']
for i, total in enumerate(data['reportedTotals']):
    assert sum(r['values'][i] or 0 for r in rows) == total, columns[i+1]
root = Path(__file__).resolve().parents[1]
(root/'publication-stats-data.js').write_text('window.publicationStatsData = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
totals = [sum(r['values'][j] or 0 for r in rows) for j in range(30)]
print('Column sums:', totals)
print('Detailed category sum:',sum(totals[:26]), 'Reported annual totals sum:', totals[29])
print('Year discrepancies (detail / reported):', [(r['year'],sum(v or 0 for v in r['values'][:26]),r['values'][29]) for r in rows if sum(v or 0 for v in r['values'][:26]) != r['values'][29]])
