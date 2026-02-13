/**
 * 🎓 Academic Intelligence Platform - Auth Layout
 */

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useAuthStore } from '@/store';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case 'student':
        return <Navigate to="/student" replace />;
      case 'educator':
        return <Navigate to="/educator" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration - removed */}
      {/* Background decoration - removed */}

      {/* Left side - Image Design */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative',
        }}
      >
        {/* Overlapping Image Design */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 650,
            height: 700,
          }}
        >
          {/* Blue Rectangle Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '65%',
              height: '65%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: 3,
              zIndex: 1,
              animation: 'slideInLeft 0.8s ease-out',
              '@keyframes slideInLeft': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-50px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          />
          
          {/* Student Image */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '80%',
              height: '80%',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
              zIndex: 2,
              background: '#fff',
              border: '12px solid white',
              animation: 'slideInRight 1s ease-out 0.3s both',
              transition: 'transform 0.3s ease',
              '@keyframes slideInRight': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(50px) translateY(20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0) translateY(0)',
                },
              },
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              },
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
              alt="Students studying together"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Right side - Auth forms */}
      <Box
        sx={{
          flex: { xs: 1, lg: 0.6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.1)',
            }}
          >
            {/* Mobile branding */}
            <Box
              sx={{
                display: { xs: 'flex', lg: 'none' },
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <SchoolIcon sx={{ fontSize: 40, color: '#2563eb' }} />
                <Typography variant="h4" fontWeight={700} sx={{ color: '#2563eb' }}>
                  Academic Intelligence
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                Kongu Engineering College
              </Typography>
            </Box>

            {/* Auth form content */}
            <Outlet />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;
