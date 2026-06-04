# Weekend School — Course Booking System

# api doc
- https://docs.google.com/document/d/119mU9hvzTyWBAWD4pUQiwTBAl5idI2J9kaJz1-9h694/edit?usp=sharing

## Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0 running locally
- Database `weekend_school` created with the schema below

### Database

```
host: localhost
port: 3306
database: weekend_school
user: root
password: password
```

Tables: `student`, `class`, `booking_transaction`, `credit_transaction`, `compensation_history`

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edit if needed
npm run dev            # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:3000
```

---

## Stack Decisions

| Layer | Choice | Reason |
|---|---|---|
| Backend runtime | Express + TypeScript | Lightweight, typed, familiar to the team |
| Database driver | mysql2/promise | Native async/await, connection pooling, parameterized queries |
| Primary keys | UUID v4 (char 36) | Avoids sequential ID enumeration, safe for distributed inserts |
| Frontend framework | Next.js 15 App Router | React Server Components for clean page composition, file-based routing |
| Styling | TailwindCSS | Utility-first, no runtime CSS-in-JS, consistent design tokens |
| HTTP client | Axios | Interceptor support, typed responses, consistent base URL config |
| Design reference | Google Stitch MCP | Pulled exact color tokens and component layouts directly into code |

---

## Architecture

### Backend — 4-layer separation

```
Route → Controller → Service → Repository → MySQL
```

- **Routes** — HTTP verb + path only
- **Controllers** — call `asyncHandler`, delegate to service, call `sendSuccess`. No try/catch.
- **Services** — business logic, DB transactions, throw `BusinessError` or `AppError`
- **Repositories** — parameterized SQL only, no business logic

### Error handling

- `AppError` hierarchy (400/404/409/503/504) for HTTP errors
- `BusinessError` with typed `BusinessCode` enum for domain errors — always returns HTTP 200 with `success: false` and a `messageCode`
- MySQL error codes mapped automatically in `errorHandler` (ER_DUP_ENTRY → 409, ECONNREFUSED → 503, etc.)
- `asyncHandler` wraps every controller — no duplicated try/catch

### Response envelope

```json
{ "success": true, "statusCode": 200, "messageCode": null, "message": "Success", "data": {} }
{ "success": false, "statusCode": 200, "messageCode": 604, "message": "Already booked", "data": null }
```

### Frontend — service / type separation

```
page.tsx → service.ts → axios (lib/api.ts) → backend
```

```
ui design power by stitch ai https://stitch.withgoogle.com/projects/3225934388126516729?pli=1
```

- **services/** — axios calls only, typed with response generics
- **types/** — API DTOs mirroring backend response shapes
- **pages** — compose services, manage local state, render UI

---

## What Is Complete

**Backend APIs**

| Endpoint | Description |
|---|---|
| `GET /api/students` | List all students |
| `GET /api/students/credits?studentId=` | Credit summary (total / used / remaining) |
| `GET /api/classes/all?studentId=` | Upcoming classes with seat count and per-student status |
| `POST /api/bookings` | Book a class (validates seat, existing booking, compensation state) |
| `PATCH /api/attend` | Mark attendance, deduct 1 credit, redeem pending makeup compensation |
| `PATCH /api/skip` | Skip class, create PENDING makeup compensation (MAKEUP_CLASS) |
| `PATCH /api/absent` | Mark absent, deduct 1 credit, no compensation |

**Business rules enforced**

- Seat capacity check before booking
- Duplicate booking detection with status-aware branching (ATTEND → COURSE_COMPLETED, ABSENT → COURSE_FORFEITED, SKIP → check compensation status)
- Single PENDING compensation per student enforcement
- Credit deduction on ATTEND and ABSENT
- Compensation auto-redemption on next ATTEND

**Frontend pages**

- `/student` — Student selector grid with live search, bento card layout
- `/booking/[studentId]` — Upcoming class cards with per-status action buttons, credit widget, confirm modal, toast notifications
- Buttons disabled when `remaining_credit <= 0`

---

## What I Would Do Next With More Time

- Add class,student creation/edit endpoints
- Add role system (admin,student)
- indexing+split transaction etc. 05-2026-transaction, 06-2026-transaction
- enhance skip and compensation
- add realtime course system.