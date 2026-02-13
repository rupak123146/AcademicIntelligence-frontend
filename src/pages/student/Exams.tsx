/**
 * 🎓 Academic Intelligence Platform - Student Exams Page
 * Production version - fetches real data from backend API
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '@/store';
import { Exam, ExamAttempt } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>{value === index && <Box pt={3}>{children}</Box>}</div>
);

type ExamType = 'available' | 'upcoming' | 'completed';

interface ExamCardProps {
  exam?: Exam;
  type: ExamType;
  attempt?: ExamAttempt;
  onStart?: () => void;
  onContinue?: () => void;
  onView?: () => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, type, attempt, onStart, onContinue, onView }) => {
  // For completed type, use attempt data if exam is not available
  const title = exam?.title || (attempt as any)?.examTitle || 'Untitled Exam';
  const description = exam?.description || '';
  const durationMinutes = exam?.durationMinutes || 0;
  const totalMarks = exam?.totalMarks || 0;
  const examType = exam?.examType || 'quiz';
  const questionCount = exam?.questions?.length || exam?.questionCount || 0;
  const startTime = exam?.startTime;

  const getStatusColor = () => {
    switch (type) {
      case 'available': return '#10b981';
      case 'upcoming': return '#f59e0b';
      case 'completed': return '#6366f1';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case 'available': return <PlayIcon />;
      case 'upcoming': return <ScheduleIcon />;
      case 'completed': return <CheckIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Avatar
            sx={{
              bgcolor: `${getStatusColor()}20`,
              color: getStatusColor(),
            }}
          >
            {getStatusIcon()}
          </Avatar>
          <Chip
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            size="small"
            sx={{
              bgcolor: `${getStatusColor()}20`,
              color: getStatusColor(),
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" fontWeight={600} mb={1}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
          {description || 'No description available'}
        </Typography>

        {/* Meta Info */}
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          {durationMinutes > 0 && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <TimerIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {durationMinutes} min
              </Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center" gap={0.5}>
            <AssignmentIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {questionCount} questions
            </Typography>
          </Box>
        </Box>

        {/* Total Marks */}
        <Box display="flex" gap={1} mb={2}>
          {totalMarks > 0 && <Chip label={`${totalMarks} marks`} size="small" variant="outlined" />}
          {examType && <Chip label={examType} size="small" variant="outlined" />}
        </Box>

        {/* Score for completed exams */}
        {type === 'completed' && attempt && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: attempt.passed ? 'success.50' : 'warning.50',
              border: '1px solid',
              borderColor: attempt.passed ? 'success.200' : 'warning.200',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Your Score
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              color={attempt.passed ? 'success.main' : 'warning.main'}
            >
              {Math.round(attempt.percentage || 0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Grade: {attempt.grade || 'N/A'}
            </Typography>
          </Box>
        )}

        {/* Scheduled date for upcoming exams */}
        {type === 'upcoming' && startTime && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Scheduled for:{' '}
              {new Date(startTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        {type === 'available' && exam?.lastAttemptStatus && ['started', 'in_progress'].includes(exam.lastAttemptStatus) ? (
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={onContinue}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            }}
          >
            Continue Exam
          </Button>
        ) : type === 'available' && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={onStart}
            disabled={exam?.canAttempt === false}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          >
            {exam?.canAttempt === false ? 'Max Attempts Reached' : 'Start Exam'}
          </Button>
        )}
        {type === 'completed' && (
          <Button fullWidth variant="outlined" onClick={onView}>
            View Results
          </Button>
        )}
        {type === 'upcoming' && (
          <Button fullWidth variant="outlined" disabled startIcon={<ScheduleIcon />}>
            Not Available Yet
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    availableExams, 
    myAttempts,
    isLoadingExams, 
    examsError,
    fetchAvailableExams,
    fetchMyAttempts,
    startExam,
    clearError,
  } = useExamStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [startingExam, setStartingExam] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (hasFetched || !token) return;
    setHasFetched(true);
    fetchAvailableExams();
    fetchMyAttempts();
  }, [hasFetched]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Ensure arrays are arrays (defensive coding)
  const examsArray = Array.isArray(availableExams) ? availableExams : [];
  const attemptsArray = Array.isArray(myAttempts) ? myAttempts : [];

  // Categorize exams
  const now = new Date();
  const available = examsArray.filter(e => 
    e.status === 'published' || e.status === 'active'
  );
  const upcoming = examsArray.filter(e => 
    e.status === 'scheduled' && e.startTime && new Date(e.startTime) > now
  );
  const completedAttempts = attemptsArray.filter(a => 
    a.status === 'submitted' || a.status === 'graded'
  );

  const filterExams = (exams: Exam[]) => {
    if (!searchQuery) return exams;
    const query = searchQuery.toLowerCase();
    return exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.description?.toLowerCase().includes(query)
    );
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setConfirmDialogOpen(true);
  };

  const handleContinueExam = (exam: Exam) => {
    if (exam.activeAttemptId) {
      navigate(`/student/exam/${exam.id}?attemptId=${exam.activeAttemptId}`);
    }
  };

  const confirmStartExam = async () => {
    if (selectedExam) {
      setStartingExam(true);
      const success = await startExam(selectedExam.id);
      setStartingExam(false);
      if (success) {
        const attemptId = useExamStore.getState().currentAttempt?.id;
        const attemptQuery = attemptId ? `?attemptId=${attemptId}` : '';
        navigate(`/student/exam/${selectedExam.id}${attemptQuery}`);
      }
    }
    setConfirmDialogOpen(false);
  };

  if (isLoadingExams) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={400} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Exams
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your available, upcoming, and completed exams
        </Typography>
      </Box>

      {examsError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {examsError}
        </Alert>
      )}

      {/* Search and Tabs */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search exams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <PlayIcon fontSize="small" />
                Available ({available.length})
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon fontSize="small" />
                Upcoming ({upcoming.length})
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <CheckIcon fontSize="small" />
                Completed ({completedAttempts.length})
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Available Exams */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filterExams(available).map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <ExamCard
                exam={exam}
                type="available"
                onStart={() => handleStartExam(exam)}
                onContinue={() => handleContinueExam(exam)}
              />
            </Grid>
          ))}
          {filterExams(available).length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No available exams found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check back later for new exams
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Upcoming Exams */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {filterExams(upcoming).map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <ExamCard exam={exam} type="upcoming" />
            </Grid>
          ))}
          {filterExams(upcoming).length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No upcoming exams scheduled
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Completed Exams */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {completedAttempts.map((attempt) => (
            <Grid item xs={12} sm={6} md={4} key={attempt.attemptId || attempt.id}>
              <ExamCard
                type="completed"
                attempt={attempt}
                onView={() => navigate(`/student/results/${attempt.attemptId || attempt.id}`)}
              />
            </Grid>
          ))}
          {completedAttempts.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <CheckIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No completed exams yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start an exam to see your results here
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Start Exam Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Start Exam</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you ready to start <strong>{selectedExam?.title}</strong>?
          </Typography>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              • Duration: {selectedExam?.durationMinutes} minutes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Questions: {selectedExam?.questions?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Total Marks: {selectedExam?.totalMarks}
            </Typography>
          </Box>
          <Typography variant="body2" color="warning.main" mt={2}>
            Note: Once started, the exam timer cannot be paused.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={startingExam}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmStartExam}
            disabled={startingExam}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          >
            {startingExam ? 'Starting...' : 'Start Exam'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamsPage;
