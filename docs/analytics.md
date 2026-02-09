# Analytics and Intelligence Engine

## Chapter-wise analysis
- Aggregate correct vs total for each chapter per student.
- Compute accuracy and identify chapters below threshold.

## Concept-wise analysis
- Similar to chapter-wise, but grouped by concept tags.

## Difficulty-level analysis
- Aggregate by difficulty (easy/medium/hard).
- Show drop-offs as difficulty increases.

## Learning gap detection
- A gap exists when accuracy < threshold and attempts_count >= minimum.
- Mark gaps at chapter and concept level.

## Feedback generation logic
- Use templates based on gap type and trend:
  - "Focus on Chapter X; accuracy is Y% over Z attempts."
  - "Review Concept Y; low accuracy at medium difficulty."

## Aggregation for educator dashboards
- Group student-level analytics into class summaries.
- Identify top 3 weak chapters and concepts.
