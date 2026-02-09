import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ExamProvider>
          <div className="app">
            <Navbar />
            <main className="app-main">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </ExamProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
