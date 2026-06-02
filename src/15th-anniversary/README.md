# 15th Anniversary Page — `/15th-anniversary/`

A celebration + biz-dev page for Integral Ed's 15 years (2011–2026), shown to
clients on our biz-dev list. Built on the existing `integralthemes` brand styles
with a sticky left-nav and animated data visualizations.

## How to add content (no coding needed)

All page content lives in one file:

```
data/anniversary-data.js
```

Open it, read the comments, and fill in the blanks. The page reads from this
file, so nothing else needs to change. Each section is labeled:

| Section in data file | Drives on the page |
|----------------------|--------------------|
| `meta`         | Hero headline + animated counters |
| `timeline`     | History timeline (2011 → 2026) |
| `evolution`    | Capability-growth visualization (laptop → curriculum → eLearning → media+tech → agentic) |
| `projects`     | Proudest work, with embedded demos/videos |
| `team`         | Tenure-trend chart + teammate cards |
| `clients`      | Featured stories + logo wall |
| `serviceAreas` | The current service areas listed in the sticky left-nav |

## Images

Drop image files into `src/assets/images/...` (e.g. `team/`, `work/`) and
reference them by path in the data file, e.g. `/assets/images/team/jane.jpg`.

## Status

- [x] Folder + data reference scaffolded
- [ ] Page structure locked (in progress with David)
- [ ] Page shell + left-nav built
- [ ] Evolution visualization built
- [ ] Content populated from `anniversary-data.js`
