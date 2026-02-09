# Academic Assessment & Performance Intelligence Platform

This repository contains an end-to-end design plus a minimal backend starter implementation (about 10% of the backend scope) for an Academic Assessment & Performance Intelligence Platform.

## Contents
- docs/architecture.md
- docs/tech-stack.md
- docs/database.md
- docs/backend.md
- docs/analytics.md
- docs/frontend.md
- docs/workflow.md
- sql/schema.sql
- sql/queries.sql
- backend/ (minimal Node.js + PostgreSQL starter)

## Quick start (backend)
1. Create a PostgreSQL database and user.
2. Copy backend/.env.example to backend/.env and update values.
3. Run the schema in sql/schema.sql.
4. Install dependencies:
   - cd backend
   - npm install
5. Start the server:
   - npm run dev

The server will start on port 4000 by default.
