// Paste this script in browser console to set up test data for exam passing logic

// 1. First, set up a demo user
const demoUser = {
  id: 'student123',
  name: 'Test Student',
  email: 'student@test.com',
  role: 'student'
};
localStorage.setItem('AUTH_TOKEN', 'demo-token-123');
localStorage.setItem('USER_DATA', JSON.stringify(demoUser));
console.log('✓ User logged in as:', demoUser.name);

// 2. Create two exam examples

// Example 1: Simple 2-question exam (passing score as percentage)
const examId1 = Date.now();
const demoExam1 = {
  id: examId1,
  title: 'Math Quiz',
  description: 'Basic math questions',
  duration: 30,
  passingScore: 40,  // 40% - this will be treated as percentage
  totalMarks: 2,
  totalQuestions: 2,
  subject: 'Mathematics',
  class: 'Class 10',
  instructions: 'Answer the questions',
  status: 'published',
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      text: 'What is 2 + 2?',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      marks: 1,
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      explanation: 'The sum of 2 and 2 is 4'
    },
    {
      id: 'q2',
      text: 'What is the capital of France?',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      marks: 1,
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
      explanation: 'Paris is the capital of France'
    }
  ]
};

// Example 2: More realistic exam like in the screenshot (30 marks, 15 passing score)
const examId2 = Date.now() + 1;
const demoExam2 = {
  id: examId2,
  title: 'CAT',
  description: 'Comprehensive exam with 30 marks',
  duration: 30,
  passingScore: 15,  // 15 marks out of 30 = 50% threshold
  totalMarks: 30,
  totalQuestions: 5,  // 5 questions × 6 marks each = 30 total
  subject: 'ENGLISH',
  class: 'Test Class',
  instructions: 'Answer all the questions',
  status: 'published',
  createdAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      text: 'Complete the sentence: She _____ to the market.',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      marks: 6,
      options: ['go', 'goes', 'went', 'going'],
      correctAnswer: 'goes',
      explanation: 'Present tense with third person singular requires "goes"'
    },
    {
      id: 'q2',
      text: 'What is the synonym of "happy"?',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      marks: 6,
      options: ['sad', 'joyful', 'angry', 'tired'],
      correctAnswer: 'joyful',
      explanation: 'Joyful is a synonym for happy'
    },
    {
      id: 'q3',
      text: 'Identify the error: "He have gone to school."',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      marks: 6,
      options: ['He', 'have', 'gone', 'school'],
      correctAnswer: 'have',
      explanation: '"have" should be "has" for third person singular'
    },
    {
      id: 'q4',
      text: 'What is the antonym of "brave"?',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      marks: 6,
      options: ['bold', 'fearless', 'cowardly', 'strong'],
      correctAnswer: 'cowardly',
      explanation: 'Cowardly is the opposite of brave'
    },
    {
      id: 'q5',
      text: 'Choose the correct spelling: ',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      marks: 6,
      options: ['occassion', 'ocasion', 'ocasion', 'occassoin'],
      correctAnswer: 'occasion',
      explanation: 'The correct spelling is "occasion"'
    }
  ]
};

const demoExams = {
  [examId1]: demoExam1,
  [examId2]: demoExam2
};

localStorage.setItem('demoExams', JSON.stringify(demoExams));

console.log('✓ Demo exams created:');
console.log('  - Exam 1 (Math Quiz): ID=' + examId1 + ', 2 questions, 2 marks, 40% passing score');
console.log('  - Exam 2 (CAT): ID=' + examId2 + ', 5 questions, 30 marks, 15 marks (50%) passing score');

console.log('\n📋 TESTING INSTRUCTIONS:');
console.log('='.repeat(60));
console.log('\nTest 1: Math Quiz (2 questions, should PASS with 1 correct)');
console.log('1. Navigate to /student/exams');
console.log('2. Select "Math Quiz" and click "Start Exam"');
console.log('3. Q1: Select "4" (CORRECT) ✓');
console.log('4. Q2: Select any wrong answer (WRONG) ✗');
console.log('5. Submit exam');
console.log('Expected Result: PASSED (1/2 = 50% >= 40%)');
console.log('');
console.log('Test 2: CAT Exam (5 questions, should PASS with 3+ correct)');
console.log('1. Navigate to /student/exams');
console.log('2. Select "CAT" and click "Start Exam"');
console.log('3. Answer at least 3 questions correctly (3 × 6 = 18 marks >= 15)');
console.log('Expected Result: PASSED (if score >= 15 marks)');
console.log('');
console.log('Test 3: Verify "Questions" column shows numbers');
console.log('✓ Both exams should show question count in the exam card');
console.log('  - Math Quiz: 2');
console.log('  - CAT: 5');
console.log('\n' + '='.repeat(60));
console.log('\nTest data has been set up. Clear browser cache if old data appears.');
