You are an expert full-stack TypeScript engineer. Build a production-quality, responsive, and feature-complete Google Photos-like media library web application. Follow every instruction precisely — do not skip, abbreviate, or defer any feature to "future work."

---

## 🎯 PROJECT OVERVIEW

A private media library app where authenticated users upload, view, organize, and search photos and videos. The frontend is React + Vite + Tailwind CSS v4. The backend is AWS AppSync (GraphQL) + DynamoDB + S3, with JWT role-based authentication. All AWS resources are mocked client-side in development using a realistic service layer that mirrors the real AWS API contracts exactly, so the real AWS integrations can be swapped in by simply replacing the mock service implementations.

---

## 🔐 AUTHENTICATION

JWT-only authentication. No sign-up flow. The login screen has a single "Access Token" text input.

**Validation:** Decode and validate the JWT client-side using the hardcoded secret `"MEDIA_LIBRARY_SECRET_2025"` with the `jose` library (not jwt-decode — use jose for signature verification). Algorithm: HS256.

**Pre-defined tokens** — generate and hardcode three valid JWTs signed with the secret above, each with a 10-year expiry. Display them as copyable chip buttons on the login screen under the label "Quick Access:".

| Token | Payload |
|-------|---------|
| Admin | `{ "sub": "user-001", "name": "Admin User", "role": "admin" }` |
| Editor | `{ "sub": "user-002", "name": "Editor User", "role": "editor" }` |
| Viewer | `{ "sub": "user-003", "name": "Viewer User", "role": "viewer" }` |

Token is stored in memory only (never localStorage — sandbox blocks it). On invalid/expired token show: `"Invalid or expired token. Please check your access token."` On login success, animate the transition to the main app with a fade + slide-up.

**Role-based permissions:**

| Feature                         | Admin | Editor | Viewer |
|--------------------------------|-------|--------|--------|
| View photos & videos           | ✅    | ✅     | ✅     |
| Upload photos & videos         | ✅    | ✅     | ❌     |
| Edit metadata (title, tags)    | ✅    | ✅     | ❌     |
| Create / rename / delete albums| ✅    | ✅     | ❌     |
| Delete photos & videos         | ✅    | ❌     | ❌     |
| View all users' uploads        | ✅    | ❌     | ❌     |
| Access Trash                   | ✅    | ❌     | ❌     |
| Set album cover                | ✅    | ✅     | ❌     |

---

## ☁️ BACKEND ARCHITECTURE

### AWS Service Layer

Create a `/src/services/aws/` directory with the following structure:

src/services/aws/
├── appsync.ts ← GraphQL client (mock: in-memory resolver)
├── dynamodb.ts ← DynamoDB service layer (mock: in-memory store)
├── s3.ts ← S3 service layer (mock: blob URLs + presigned URL simulation)
├── schema.graphql ← Full AppSync GraphQL schema
└── index.ts ← Re-exports all services


All three AWS services are mocked with realistic async latency (150–400ms simulated delay via `setTimeout`). Every mock function must have a corresponding real AWS SDK v3 implementation commented out directly below it, ready to be uncommented. Example pattern:

```ts
// MOCK — replace with real AWS SDK call in production
export async function getMediaItem(id: string): Promise<MediaItem> {
  await simulateLatency(200);
  return mockStore.media[id];
  
  // REAL AWS (uncomment in production):
  // const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  // const cmd = new GetItemCommand({ TableName: 'MediaItems', Key: { PK: { S: `MEDIA#${id}` }, SK: { S: 'METADATA' } } });
  // const res = await client.send(cmd);
  // return unmarshall(res.Item) as MediaItem;
}
```

---

### AppSync GraphQL Schema

Define the full GraphQL schema in `schema.graphql`:

```graphql
type Query {
  listMedia(userId: ID, albumId: ID, nextToken: String, limit: Int): MediaConnection!
  getMedia(id: ID!): MediaItem
  searchMedia(query: String!, filters: SearchFilters): MediaConnection!
  listAlbums(userId: ID): [Album!]!
  getAlbum(id: ID!): Album
  requestUploadUrl(filename: String!, contentType: String!, fileSize: Int!): UploadSession!
}

type Mutation {
  finalizeUpload(input: FinalizeUploadInput!): MediaItem!
  updateMediaMetadata(id: ID!, input: UpdateMetadataInput!): MediaItem!
  deleteMedia(id: ID!): DeleteResult!
  restoreMedia(id: ID!): MediaItem!
  emptyTrash(userId: ID!): BatchDeleteResult!
  createAlbum(input: CreateAlbumInput!): Album!
  updateAlbum(id: ID!, input: UpdateAlbumInput!): Album!
  deleteAlbum(id: ID!): DeleteResult!
  addToAlbum(mediaId: ID!, albumId: ID!): Album!
  removeFromAlbum(mediaId: ID!, albumId: ID!): Album!
  setAlbumCover(albumId: ID!, mediaId: ID!): Album!
}

type Subscription {
  onUploadComplete(userId: ID!): MediaItem
  onMediaDeleted(userId: ID!): DeleteResult
}

type MediaItem {
  id: ID!
  filename: String!
  type: MediaType!
  s3Key: String!
  s3Bucket: String!
  thumbnailS3Key: String!
  originalUrl: String!
  thumbnailUrl: String!
  size: Int!
  width: Int
  height: Int
  duration: Float
  dateTaken: AWSDateTime!
  uploadedAt: AWSDateTime!
  uploadedBy: String!
  uploadedByUserId: ID!
  tags: [String!]!
  description: String
  albumIds: [ID!]!
  status: MediaStatus!
  exif: EXIF
  deletedAt: AWSDateTime
}

type Album {
  id: ID!
  name: String!
  description: String
  coverMediaId: ID
  coverThumbnailUrl: String
  mediaIds: [ID!]!
  mediaCount: Int!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  createdBy: ID!
}

type UploadSession {
  uploadId: String!
  presignedUrl: String!
  s3Key: String!
  s3Bucket: String!
  expiresAt: AWSDateTime!
}

type MediaConnection {
  items: [MediaItem!]!
  nextToken: String
  total: Int!
}

type EXIF {
  make: String
  model: String
  exposureTime: String
  fNumber: Float
  iso: Int
  focalLength: String
  gpsLat: Float
  gpsLng: Float
  takenAt: AWSDateTime
}

type DeleteResult { id: ID!, success: Boolean! }
type BatchDeleteResult { deletedCount: Int!, success: Boolean! }

enum MediaType { PHOTO VIDEO }
enum MediaStatus { ACTIVE DELETED PROCESSING }

input SearchFilters {
  mediaType: MediaType
  tags: [String!]
  dateFrom: AWSDateTime
  dateTo: AWSDateTime
  albumId: ID
}

input FinalizeUploadInput {
  uploadId: String!
  filename: String!
  contentType: String!
  size: Int!
  width: Int
  height: Int
  duration: Float
  dateTaken: AWSDateTime
  exif: EXIFInput
  tags: [String!]
}

input EXIFInput {
  make: String
  model: String
  exposureTime: String
  fNumber: Float
  iso: Int
  focalLength: String
  gpsLat: Float
  gpsLng: Float
  takenAt: AWSDateTime
}

input UpdateMetadataInput {
  filename: String
  tags: [String!]
  description: String
}

input CreateAlbumInput { name: String!, description: String }
input UpdateAlbumInput { name: String, description: String }
```

---

### DynamoDB Data Model

#### Table Design (Single-table pattern)

**Table name:** `FolioMediaLibrary`
**Partition key:** `PK (String)` | **Sort key:** `SK (String)`
**GSI 1:** `GSI1PK / GSI1SK` — for listing media by user and date
**GSI 2:** `GSI2PK / GSI2SK` — for album membership queries
**GSI 3:** `StatusIndex` — for trash/active filtering

| Entity | PK | SK | GSI1PK | GSI1SK |
|--------|----|----|--------|--------|
| Media Item | `MEDIA#{id}` | `METADATA` | `USER#{userId}` | `DATE#{dateTaken}` |
| Album | `ALBUM#{id}` | `METADATA` | `USER#{userId}` | `ALBUM#{createdAt}` |
| Album Member | `ALBUM#{albumId}` | `MEDIA#{mediaId}` | `MEDIA#{mediaId}` | `ALBUM#{albumId}` |
| Deleted Item | `TRASH#{userId}` | `DATE#{deletedAt}#MEDIA#{id}` | — | — |

Implement this exact key design in the mock DynamoDB store using a `Map<string, Record<string, unknown>>` keyed by `PK#SK`. All queries must simulate GSI lookups by filtering the map.

#### TypeScript Types

```ts
// DynamoDB item shapes (raw, before unmarshalling to app types)
interface DDBMediaItem {
  PK: string;            // MEDIA#{id}
  SK: string;            // METADATA
  GSI1PK: string;        // USER#{uploadedByUserId}
  GSI1SK: string;        // DATE#{dateTaken}
  GSI2PK?: string;       // ALBUM#{albumId} — set per album membership record
  id: string;
  filename: string;
  type: 'PHOTO' | 'VIDEO';
  s3Key: string;
  s3Bucket: string;
  thumbnailS3Key: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  dateTaken: string;     // ISO 8601
  uploadedAt: string;
  uploadedBy: string;
  uploadedByUserId: string;
  tags: string[];
  description?: string;
  albumIds: string[];
  status: 'ACTIVE' | 'DELETED' | 'PROCESSING';
  exif?: {
    make?: string; model?: string; exposureTime?: string;
    fNumber?: number; iso?: number; focalLength?: string;
    gpsLat?: number; gpsLng?: number; takenAt?: string;
  };
  deletedAt?: string;
}

interface DDBAlbum {
  PK: string;            // ALBUM#{id}
  SK: string;            // METADATA
  GSI1PK: string;        // USER#{createdBy}
  GSI1SK: string;        // ALBUM#{createdAt}
  id: string;
  name: string;
  description?: string;
  coverMediaId?: string;
  mediaIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

---

### S3 Architecture

**Buckets (mocked):**
- `folio-originals` — full-resolution uploads
- `folio-thumbnails` — auto-generated 400×300 thumbnails
- `folio-previews` — medium-res previews (1200px max width)

**S3 Key conventions:**
originals/{userId}/{year}/{month}/{uuid}.{ext}
thumbnails/{userId}/{year}/{month}/{uuid}_thumb.webp
previews/{userId}/{year}/{month}/{uuid}_preview.webp


**Presigned Upload Flow (mock simulation):**

1. Client calls `requestUploadUrl` GraphQL mutation → server returns `UploadSession` with a fake presigned URL and `uploadId`.
2. Client uploads file directly to the fake presigned URL (in mock: stores as a blob URL).
3. Client calls `finalizeUpload` mutation with `uploadId` + extracted metadata.
4. Server creates the DynamoDB record and returns the full `MediaItem`.
5. On success, fire an AppSync Subscription event `onUploadComplete`.

In the mock, simulate presigned URL as:
```ts
const presignedUrl = URL.createObjectURL(file); // blob URL for the mock
```

In the real AWS implementation (commented out), use:
```ts
// const cmd = new PutObjectCommand({ Bucket: 'folio-originals', Key: s3Key, ContentType });
// const presignedUrl = await getSignedUrl(s3Client, cmd, { expiresIn: 3600 });
```

---

## 🗂️ CORE FEATURES

### 1. Photo & Video Grid (Main View)
- Masonry/justified grid layout, similar to Google Photos
- Thumbnails grouped by month/year date headers (e.g., "April 2026")
- Hover state: filename overlay, video duration badge, checkmark for multi-select
- Click → full-screen lightbox viewer
- Videos play inline in lightbox with native controls + custom play/pause overlay
- Infinite scroll with cursor-based pagination using `nextToken` from `listMedia`
- Skeleton shimmer loader matching the grid layout shown on initial load and page turns
- Multi-select mode: checkbox appears on hover, shift+click for range select, bulk actions bar appears at top

### 2. Upload (Presigned S3 Flow)
- Drag-and-drop zone OR click to pick files
- Accepted: `.jpg .jpeg .png .webp .heic .gif .mp4 .mov .avi`
- Per-file upload progress bar with filename and file size
- Concurrent uploads: all files upload simultaneously (not sequentially)
- **Two-phase flow:**
  - Phase 1: Call `requestUploadUrl` → get presigned URL per file
  - Phase 2: PUT file to presigned URL, then call `finalizeUpload`
- Extract EXIF data client-side using `exifr` library before upload
- After finalize, newly uploaded items animate into the top of the grid

### 3. Albums
- Sidebar album list: cover thumbnail, name, item count
- Create: inline name input on "+ New Album" click, Enter to confirm
- Rename: double-click album name in sidebar
- Delete: trash icon → confirm modal (Admin/Editor only)
- Add to album: right-click thumbnail → context menu → "Add to Album" → submenu of albums
- Remove from album: available in metadata panel album membership list
- Album detail view: filtered grid via `listMedia(albumId: ...)` query
- Cover photo: first item or manually set via "Set as Cover" in context menu

### 4. Search & Filter
- Search bar always visible in top bar
- Real-time search via `searchMedia` query (debounced 300ms)
- Matches: filename, tags, description
- Advanced filter panel (collapsible below search bar):
  - Date range: from/to date pickers
  - Media type: Photo / Video / Both toggle buttons
  - Tags: multi-tag input (type + Enter to add, × to remove)
  - Album: dropdown of existing albums
- Active filters shown as removable chips below search bar
- "No results" empty state: illustrated icon + message + "Clear all filters" button

### 5. Metadata Panel
- Opens as right-side drawer (480px wide on desktop, full bottom sheet on mobile)
- Triggered by clicking the ℹ️ icon in the lightbox
- Fields displayed (and editable for Admin/Editor):
  - Filename (inline edit)
  - Date taken (display only)
  - Uploaded by + upload date
  - File size (human-readable)
  - Dimensions (photos) or duration + resolution (videos)
  - MIME type
  - EXIF data block: camera make/model, ISO, aperture, exposure, GPS coordinates
  - Tags (chip input, editable)
  - Description (textarea, editable)
  - Albums membership (list with "Remove" button per album)
- Dirty state indicator: `●` dot in panel header when unsaved changes exist
- Save via GraphQL `updateMediaMetadata` mutation
- Optimistic update: immediately reflect changes in the grid before server confirms

---

## 🧭 NAVIGATION & LAYOUT

**Left Sidebar (collapsible, 240px expanded / 64px icon-only):**
- SVG logo: camera aperture icon + "Folio" wordmark in teal
- Nav: Photos, Albums, Search, Trash (Admin only)
- Scrollable album list section
- User badge: avatar initial circle, name, RoleBadge, logout button
- Collapse toggle button at bottom of sidebar

**Top Bar (56px height):**
- Hamburger icon (mobile) / breadcrumb (desktop)
- Search input (grows to fill center space)
- Upload button (hidden for Viewer)
- Theme toggle (sun/moon)
- Notification bell (greyed out, aria-disabled)

**Main content:** single scroll region, no nested scrollers.

**Routes:**
/ → Photos grid (all media)
/albums → Albums overview grid
/albums/:id → Single album grid
/search → Search results
/trash → Trash (Admin only, redirect others to /)


---

## 🎨 DESIGN SYSTEM

- **Font:** Inter via Google Fonts (`wght@300..700`)
- **Accent:** `#01696f` light / `#4f98a3` dark (teal)
- **Surfaces:** warm neutrals light mode, dark charcoal dark mode
- **Radius:** thumbnails 6px, cards 8px, modals/panels 12px, pills full
- **Motion:** 180ms `cubic-bezier(0.16, 1, 0.3, 1)`. Lightbox: fade + scale from thumbnail position. Upload cards: slide-up + fade-in.
- **Breakpoints:** 375px mobile, 768px tablet, 1280px desktop
- **Mobile:** sidebar → bottom tab bar (Photos, Albums, Search, Upload)
- **Dark mode:** `prefers-color-scheme` + manual toggle stored in memory, `data-theme` on `<html>`

---

## 🗄️ SEED DATA

Seed 30 mock `MediaItem` records and 4 albums at app startup.

- Mix: 22 photos + 8 videos
- Spread dateTaken across the last 6 months
- Use `https://picsum.photos/seed/{id}/800/600` for originalUrl
- Use `https://picsum.photos/seed/{id}/400/300` for thumbnailUrl
- Video items: set `duration` between 15–180 seconds, use a picsum thumbnail
- Tags: each item has 1–4 tags from this pool: `["travel", "family", "work", "nature", "city", "food", "portrait", "landscape", "event", "sunset"]`
- EXIF data: populate make/model/ISO for photo items (mock values like "Canon EOS R5", "Sony A7IV")
- Albums: "Family" (8 items), "Vacation 2025" (10 items), "Work" (6 items), "Favorites" (5 items)
- Some items belong to multiple albums

---

## 🗑️ TRASH

- `deleteMedia` sets `status: "DELETED"` and `deletedAt` in DynamoDB, does NOT remove the S3 key
- Trash view: grid of deleted items showing date deleted, filename, thumbnail
- Per-item: "Restore" button (calls `restoreMedia` mutation, sets status back to ACTIVE)
- "Empty Trash" button: calls `emptyTrash` mutation, permanently removes DynamoDB records (in real AWS: also deletes S3 objects)
- Admin only: redirect non-admins to `/`

---

## ♿ ACCESSIBILITY

- Semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`, `<section>`, `<article>`
- Single `<h1>` per route, correct heading hierarchy
- Lightbox: focus trap, close on Escape, `role="dialog"` + `aria-modal="true"`
- Upload zone: keyboard-activatable (Enter/Space), `role="button"`, `aria-label`
- All `<img>` have meaningful `alt` from filename
- All icon-only buttons: `aria-label` + Tooltip on hover (built with Lucide icons)
- Skip-to-content link as first focusable element
- WCAG AA contrast for all text on all surfaces
- `prefers-reduced-motion` disables all animations via CSS

---

## 📐 COMPONENT LIST
```bash
src/
├── components/
│ ├── media/
│ │ ├── MediaGrid.tsx ← masonry grid with date grouping
│ │ ├── MediaThumbnail.tsx ← card with hover, checkbox, type badge
│ │ ├── Lightbox.tsx ← full-screen viewer, keyboard nav
│ │ ├── MetadataPanel.tsx ← right panel, all fields, dirty state
│ │ └── UploadZone.tsx ← drag-drop, per-file progress
│ ├── albums/
│ │ ├── AlbumList.tsx ← sidebar album nav
│ │ ├── AlbumCard.tsx ← album grid card
│ │ └── AlbumCoverPicker.tsx ← cover selection modal
│ ├── search/
│ │ ├── SearchBar.tsx ← input + filter toggle
│ │ └── FilterPanel.tsx ← collapsible filters
│ ├── layout/
│ │ ├── Sidebar.tsx ← collapsible left sidebar
│ │ ├── TopBar.tsx ← top navigation bar
│ │ ├── MobileTabBar.tsx ← mobile bottom navigation
│ │ └── SkeletonGrid.tsx ← shimmer loading skeleton
│ └── ui/
│ ├── TokenLoginScreen.tsx ← login with copyable token chips
│ ├── RoleBadge.tsx ← admin=teal, editor=amber, viewer=slate
│ ├── ConfirmModal.tsx ← reusable confirm dialog
│ ├── ContextMenu.tsx ← right-click menu
│ ├── Tooltip.tsx ← hover tooltip wrapper
│ └── TrashView.tsx ← admin trash grid
├── contexts/
│ ├── AuthContext.tsx ← JWT decode, role, current user
│ ├── MediaContext.tsx ← media state, pagination, mutations
│ └── AlbumContext.tsx ← album state + mutations
├── services/aws/
│ ├── appsync.ts
│ ├── dynamodb.ts
│ ├── s3.ts
│ ├── schema.graphql
│ └── index.ts
├── hooks/
│ ├── useInfiniteScroll.ts
│ ├── useDebounce.ts
│ ├── useMediaQuery.ts
│ └── useExif.ts
└── pages/
├── PhotosPage.tsx
├── AlbumsPage.tsx
├── AlbumDetailPage.tsx
├── SearchPage.tsx
└── TrashPage.tsx
```
---

## ⚙️ TECHNICAL REQUIREMENTS

- **Vite + React 18 + TypeScript** (strict mode)
- **Tailwind CSS v4** — all styling via utility classes, no inline styles, no CSS modules
- **react-router-dom v6** — URL routing
- **jose** — JWT decode + HS256 signature verification
- **exifr** — client-side EXIF extraction from image files before upload
- **Lucide React** — icons only, no other icon library
- No external UI component libraries (build all UI from scratch)
- State in-memory (no localStorage, no sessionStorage — sandbox blocks both)
- All AWS service calls go through `/src/services/aws/` — no direct SDK calls in components
- Every GraphQL operation must be typed with the schema types
- Optimistic updates: mutations update local state immediately, rollback on error
- Error boundaries: each page wrapped in an `<ErrorBoundary>` with a friendly fallback UI