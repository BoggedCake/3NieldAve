"""Check actual rendered PNG pixels at the image-to-navy boundary.
Run after hero-qa.cjs: python tests/hero-edge-qa.py /tmp/fern-exact-hero
"""
import json
import sys
from pathlib import Path
from PIL import Image

output = Path(sys.argv[1])
navy = (57, 68, 86)
results = []
for record in json.loads((output / 'results.json').read_text()):
    width = record['width']
    image = Image.open(output / f'hero-{width}-after.png').convert('RGB')
    background = record['background']
    if width < 1024:
        # Sample inside the clear side gutter, outside the foreground copy.
        points = [(image.width - 2, round(background['height']) + d) for d in (-1, 0, 1)]
    else:
        points = [(round(background['width']) + d, y) for d in (-1, 0, 1)
                  for y in (0, 180, 360, 700)]
    delta = max(abs(actual - expected) for point in points
                for actual, expected in zip(image.getpixel(point), navy))
    assert delta <= 2, f'{width}px image edge differs from surrounding navy by {delta}'
    results.append({'width': width, 'maxChannelDifferenceAtEdge': delta, 'status': 'passed'})
# Exercise the previous fixed-720px failure with a taller, 900px hero.
image = Image.open(output / 'hero-expanded-900.png').convert('RGB')
delta = max(abs(actual - expected) for x in (899, 900, 901) for y in (0, 225)
            for actual, expected in zip(image.getpixel((x, y)), navy))
assert delta <= 2, f'Expanded hero retains a hard edge: {delta}'
results.append({'heroHeight': 900, 'maxChannelDifferenceAtEdge': delta, 'status': 'passed'})
(output / 'edge-results.json').write_text(json.dumps(results, indent=2) + '\n')
print('Six viewport image edges and expanded-hero boundary match navy within 2 RGB levels.')
