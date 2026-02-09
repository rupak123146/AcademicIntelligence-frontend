# Database Design

## Relational schema (PostgreSQL)

### Core entities
- institutions
- users
- exams
- questions
- question_options
- exam_questions
- attempts
- attempt_answers

### Taxonomy and tagging
- chapters
- concepts
- question_tags (chapter, concept)

### Analytics summaries
- analytics_student_chapter
- analytics_student_concept
- analytics_student_difficulty
- analytics_class_summary

## ER diagram explanation
- An institution has many users and exams.
- A user can be a student, educator, or admin (role stored in users).
- An exam is created by an educator and contains many questions.
- Questions can be tagged to chapters and concepts.
- Students attempt exams; each attempt has multiple answers.
- Analytics tables store aggregated performance per student, chapter, concept, and difficulty.

## NoSQL collections for analytics logs
- exam_events: raw events (start, submit, timeout).
- question_events: question-level interactions (view, select, time_spent).
- analytics_jobs: job runs, status, timing, and errors.

The full SQL schema is in sql/schema.sql.
