# BroadcastED — Content Broadcasting System

> **Made by Janvi**

A full-featured educational content broadcasting platform built with **Next.js 14**, **Tailwind CSS**, **React Hook Form + Zod**, and a clean service-layer architecture.

---

## ✨ Features

| Area                    | Details                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Auth**                | Login with Zod validation, role-based redirect, demo credential buttons                                       |
| **Teacher Dashboard**   | Stats cards, recent content grid, upload shortcut                                                             |
| **Upload Content**      | Drag & drop, file preview, type/size validation (JPG/PNG/GIF, max 10MB), scheduling fields, rotation duration |
| **My Content**          | Filter tabs (all/pending/approved/rejected) with counts, rejection reason display                             |
| **Principal Dashboard** | Stats + pending content table with thumbnails                                                                 |
| **Approvals**           | Approve/reject cards, full preview modal, mandatory rejection reason modal                                    |
| **All Content**         | Search, status filter, pagination (15/page), schedule status badges                                           |
| **Live Page**           | `/live/:teacherId` — public, no auth, auto-polls every 30s, featured broadcast layout                         |

---

## 🚀 Quick Start

```bash
unzip broadcasted-v2.zip
cd broadcast-v2
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role      | Email                | Password   |
| --------- | -------------------- | ---------- |
| Teacher   | `teacher@demo.com`   | `password` |
| Teacher 2 | `teacher2@demo.com`  | `password` |
| Principal | `principal@demo.com` | `password` |

---

## 📡 Public Live Page (no login required)

```
http://localhost:3000/live/teacher-1
http://localhost:3000/live/teacher-2
```

Auto-refreshes every 30 seconds. Shows only approved, currently-active content.

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Login page
│   ├── teacher/          # Dashboard, Upload, My Content
│   ├── principal/        # Dashboard, Approvals, All Content
│   └── live/[teacherId]/ # Public broadcast page
├── components/
│   ├── shared/           # Sidebar, ContentCard, Modal, StatsCard,
│   │                       StatusBadge, Skeleton, EmptyState, etc.
│   └── principal/        # RejectModal
├── services/             # ← All API calls live here
│   ├── auth.service.js
│   ├── content.service.js
│   └── approval.service.js
├── hooks/                # useContent, useDebounce
├── context/              # AuthContext
├── lib/                  # apiClient, mockData
└── utils/                # helpers, formatters
```

---

## 🔌 Connecting a Real Backend

All API logic is isolated in `src/services/`. Each method has a comment showing the real endpoint:

```js
// In content.service.js:
// Real → GET /api/content?status=&search=
// Replace mock block with:
return apiClient.get("/api/content", { status, search });
```

Set your API base URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-api.com
```

The `apiClient.js` automatically attaches `Authorization: Bearer <token>` to every request.

---

## 🛠 Tech Stack

- **Next.js 14** — App Router
- **React 18**
- **Tailwind CSS** — custom design system (Syne + Outfit + JetBrains Mono fonts)
- **React Hook Form + Zod** — form validation
- **date-fns** — date/time formatting
- **lucide-react** — icons
- **react-hot-toast** — notifications

---

## 📋 Assignment Coverage

| Requirement                                   | Status |
| --------------------------------------------- | ------ |
| Authentication + role redirect                | ✅     |
| Teacher: dashboard, upload, my-content        | ✅     |
| Principal: dashboard, approvals, all-content  | ✅     |
| Upload validation (type, size, end > start)   | ✅     |
| Approval workflow with rejection reason modal | ✅     |
| Live broadcast page `/live/:teacherId`        | ✅     |
| Scheduling fields (start, end, rotation)      | ✅     |
| Schedule status (scheduled/active/expired)    | ✅     |
| Service layer (no API calls in components)    | ✅     |
| Loading / Error / Empty states                | ✅     |
| Skeleton loaders                              | ✅     |
| Toasts                                        | ✅     |
| Search + filter + pagination                  | ✅     |
| Auto-polling (30s) on live page               | ✅     |
| File preview before upload                    | ✅     |
| Drag & drop upload                            | ✅     |
| Responsive layout                             | ✅     |
| Frontend-notes.txt documentation              | ✅     |

---

## 📝 Documentation

See `Frontend-notes.txt` for detailed notes on architecture, auth flow, state management, API integration strategy, and all assumptions.

---

> Made by **Janvi** · BroadcastED © 2026
