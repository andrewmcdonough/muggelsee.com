# Müggelsee

An English-language community and tourism guide for the Müggelsee area of Berlin — forests, lakes, villages, and the people who live there.

Built with [Hugo](https://gohugo.io/) and deployed on Netlify. Maps via Mapbox GL JS.

---

## Setup

### Prerequisites

- [Hugo extended](https://gohugo.io/installation/) v0.159.1 or later (the **extended** version is required for CSS processing)

Install on macOS via Homebrew:

```bash
brew install hugo
```

### Local development

```bash
hugo server
```

The site is served at `http://localhost:1313`. Hugo watches for file changes and reloads automatically.

### Build for production

```bash
hugo --minify
```

Output goes to `public/`.

---

## Deployment

The site is not yet on Netlify (no `netlify.toml` exists). When you're ready to deploy, create `netlify.toml` in the project root:

```toml
[build]
  command = "hugo --minify"
  publish = "public"

[build.environment]
  HUGO_VERSION = "0.159.1"
```

Then connect the repo to a new Netlify site and deploy.

---

## Content types

### Places

The core content type. Each place is a **leaf bundle** — a folder with an `index.md` and any associated photos.

**Create a new place:**

```bash
hugo new content places/cafe-mueggel/index.md
```

Or just create the folder and file manually.

**Front matter (`content/places/<slug>/index.md`):**

```toml
+++
title         = "Café Müggel"
date          = 2025-01-01
draft         = false

# Discovery
tags          = ["cafe", "family-friendly"]
area          = "friedrichshagen"   # must match an id in data/areas.json

# Map pin
lat           = 52.4580
lon           = 13.6215

# Details
rating        = 7.5                 # out of 10, shown as "7.5 / 10"
featured      = false               # appears in the homepage featured grid if true
address       = "Bölschestraße 12, 12587 Berlin"
website       = "https://example.com"
opening_hours = "Tue–Sun 9:00–18:00"
+++

Place description goes here as markdown.
```

**Available tags** (defined in `data/categories.json`):

| Slug | Label |
|------|-------|
| `swimming` | Swimming |
| `restaurant` | Restaurants |
| `cafe` | Cafés |
| `hiking` | Hiking |
| `cycling` | Cycling |
| `family-friendly` | Family |
| `viewpoint` | Viewpoints |
| `history` | History |
| `watersports` | Watersports |
| `nature` | Nature |

**Available areas** (defined in `data/areas.json`):

`friedrichshagen`, `rahnsdorf`, `wendenschloss`, `mueggelheim`, `koepenick`, `hirschgarten`, `erkner`, `schoeneiche`, `woltersdorf`

---

### Areas

Area pages live in `content/areas/`. Each area has its own **section** folder with an `_index.md`. The top-level `content/areas/_index.md` is the `/areas/` listing page.

Area pages automatically pull in:
- A Mapbox map of all places in that area, filterable by category
- A roll-up photo gallery of all photos from all places in that area

**Create a new area:**

1. Add an entry to `data/areas.json`:

```json
{
  "id": "my-area",
  "label": "My Area",
  "url": "/areas/my-area/",
  "center": [52.440, 13.650],
  "zoom": 14,
  "color": "#457b9d"
}
```

Note: `center` is `[latitude, longitude]`.

2. Create `content/areas/my-area/_index.md`:

```toml
+++
title           = "My Area"
date            = 2025-01-01
draft           = false
area_id         = "my-area"         # must match the id in data/areas.json
tagline         = "One line about this area"
map_center_lat  = 52.440
map_center_lon  = 13.650
map_zoom        = 14
+++

Area description as markdown.
```

---

### Community groups

Group pages live in `content/community/`. Each group is a **leaf bundle** (`index.md`, not `_index.md`).

**Create a new group:**

```bash
mkdir content/community/my-group
```

Then create `content/community/my-group/index.md`:

```toml
+++
title          = "My Group"
date           = 2025-01-01
draft          = false
tagline        = "What the group is about"
signup_label   = "my-group"         # used as the checkbox value in the signup form
meet_frequency = "Monthly"
meet_location  = "Köpenick area"
icon           = "🎨"
+++

Group description and what to expect.
```

---

### Events

Events live in `content/events/`. Each event is a leaf bundle.

**Create a new event:**

```bash
mkdir content/events/my-event
```

Then create `content/events/my-event/index.md`:

```toml
+++
title         = "Summer Swim"
date          = 2025-07-15
draft         = false
event_date    = 2025-07-15
location_name = "Strandbad Müggelsee"
lat           = 52.4330
lon           = 13.6490
tags          = ["swimming", "family-friendly"]
area          = "rahnsdorf"
+++

Event description.
```

---

### Guides

Evergreen informational articles. Live in `content/guides/`.

**Create a new guide:**

```bash
mkdir content/guides/getting-around
```

Then create `content/guides/getting-around/index.md`:

```toml
+++
title       = "Getting Around by Bike"
date        = 2025-01-01
draft       = false
description = "The best cycling routes around the lake"
+++

Guide content as markdown.
```

---

## Photos

### Supported formats

Hugo's image processing works with **JPEG, PNG, WebP, GIF, and TIFF**. It does not support HEIC (iPhone default).

### Converting iPhone photos

```bash
# Single file — convert and resize to 2400px wide
sips -s format jpeg -Z 2400 photo.heic --out photo.jpg

# Batch convert an entire folder
for f in *.heic; do sips -s format jpeg -Z 2400 "$f" --out "${f%.heic}.jpg"; done
```

2400px wide is a good target: large enough for Hugo to generate sharp hero images and lightbox views, small enough for git (typically 300–800 KB as a JPEG).

### Adding photos to a place

1. Drop the converted JPEG files into the place's folder:

```
content/places/strandbad-mueggelsee/
├── index.md
├── beach.jpg
├── lake-view.jpg
└── forest-path.jpg
```

2. Add `[[resources]]` blocks to `index.md` to set order and captions:

```toml
[[resources]]
  src = "beach.jpg"
  [resources.params]
    caption = "The main sandy beach looking out over the lake"

[[resources]]
  src = "lake-view.jpg"
  [resources.params]
    caption = "View across the Müggelsee on a clear morning"

[[resources]]
  src = "forest-path.jpg"
  # caption is optional — leave out the [resources.params] block to omit it
```

The **first** `[[resources]]` entry is the hero image, shown full-width at the top of the place page. The rest appear as thumbnails below the description. All are accessible via the lightbox (click any image, then use arrow keys or the on-screen buttons to navigate).

If you omit `[[resources]]` blocks entirely, Hugo uses all images in the folder in alphabetical filename order.

### Where photos appear

| Location | What shows |
|----------|-----------|
| Place page (`/places/<slug>/`) | Hero image at top, thumbnail grid below description |
| Area page (`/areas/<slug>/`) | Roll-up gallery of all photos from all places in that area |
| Gallery page (`/gallery/`) | All photos from all places site-wide |

Hugo processes and caches all image derivatives (hero crop, thumbnails, lightbox-size) on first build. Subsequent builds with unchanged images are fast.

---

## Data files

### `data/areas.json`

Defines the areas shown on the homepage map and listed on `/areas/`. Each entry needs a matching `content/areas/<id>/` section folder.

### `data/categories.json`

Defines the tag categories used for place tags and map filters. To add a new category, add an entry here and use the slug in place front matter.

---

## Site configuration

Key settings in `hugo.toml`:

| Setting | Purpose |
|---------|---------|
| `params.mapbox_token` | Mapbox public token — safe to commit, restrict by URL in the Mapbox dashboard |
| `params.mapbox_style` | Mapbox style URL |
| `params.map_default_lat/lon/zoom` | Homepage map initial view |
| `params.formspree_id` | Formspree form ID for the community signup form (leave empty to disable) |
