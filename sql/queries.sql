
-- Chapter-wise accuracy for a student
SELECT
    c.id AS chapter_id,
    c.name AS chapter_name,
    SUM(CASE WHEN aa.is_correct THEN 1 ELSE 0 END) AS correct_count,
    COUNT(*) AS total_count,
    ROUND(
        100.0 * SUM(CASE WHEN aa.is_correct THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
        2
    ) AS accuracy
FROM attempt_answers aa
JOIN questions q ON q.id = aa.question_id
JOIN question_chapter_tags qt ON qt.question_id = q.id
JOIN chapters c ON c.id = qt.chapter_id
JOIN attempts a ON a.id = aa.attempt_id
WHERE a.student_id = $1
GROUP BY c.id, c.name
ORDER BY accuracy ASC;

-- Difficulty-wise accuracy for a student
SELECT
    q.difficulty,
    SUM(CASE WHEN aa.is_correct THEN 1 ELSE 0 END) AS correct_count,
    COUNT(*) AS total_count,
    ROUND(
        100.0 * SUM(CASE WHEN aa.is_correct THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
        2
    ) AS accuracy
FROM attempt_answers aa
JOIN questions q ON q.id = aa.question_id
JOIN attempts a ON a.id = aa.attempt_id
WHERE a.student_id = $1
GROUP BY q.difficulty;
