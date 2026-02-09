# System Architecture

## High-level overview
The platform converts question-level exam responses into actionable academic intelligence. It collects raw exam data, evaluates results, runs analytics, and presents insights to students, educators, and institutions.

## Clean, layered architecture diagram
```mermaid
flowchart LR
    U1[Student] --> FE[Web Frontend]
    U2[Educator] --> FE
    U3[Admin/Institution] --> FE

    FE --> API[Backend API]
    API --> AUTH[Auth Service]
    API --> EXAM[Exam Service]
    API --> EVAL[Evaluation Engine]
    API --> ANALYTICS[Analytics Orchestrator]

    AUTH --> SQL[(PostgreSQL)]
    EXAM --> SQL
    EVAL --> SQL
    ANALYTICS --> SQL

    ANALYTICS --> NOSQL[(NoSQL Analytics Logs)]
    ANALYTICS --> PY[Python Analytics Jobs]
    PY --> SQL

    API --> DASH[Dashboards]
    DASH --> FE
```

## Data flow and integration points
1. Frontend sends authenticated requests to Backend API.
2. Auth service validates credentials and issues JWT tokens.
3. Exam service manages exams, questions, and attempts.
4. Evaluation engine scores attempts and writes results.
5. Analytics orchestrator triggers batch/near-real-time analytics.
6. Python analytics jobs aggregate results and store summaries.
7. Dashboards read summaries for student, educator, and admin views.
