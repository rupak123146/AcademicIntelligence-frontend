# Backend Design

## REST API structure (minimal starter)

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Exams
- POST /api/exams
- POST /api/exams/:examId/questions
- POST /api/exams/:examId/publish
- POST /api/exams/:examId/assign
- POST /api/exams/:examId/submit

### Student summary (example)
- GET /api/students/me/summary

### Classes
- POST /api/classes
- POST /api/classes/:classId/enroll

## Auth flow
1. User submits email + password.
2. Server verifies password hash.
3. Server issues JWT with user id, role, institution id.
4. Frontend stores JWT and sends it in Authorization header.

## Evaluation engine logic
- Fetch correct options for all exam questions.
- For each answer, compare selected option to correct option.
- Score: sum marks; apply negative marks for wrong answers if enabled.
- Store per-question correctness and final attempt summary.

## Analytics triggering flow
- After submission, enqueue analytics job (future enhancement).
- Batch analytics job aggregates chapter, concept, and difficulty stats.
