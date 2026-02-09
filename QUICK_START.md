# 🚀 Quick Start Guide - ExamPlatform Frontend

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 3. Start Development Server
```bash
npm start
```
Opens at: `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

---

## 📱 Test User Accounts

### Student Account
```
Email: student@example.com
Password: password123
Role: Student
```

### Faculty Account
```
Email: faculty@example.com
Password: password123
Role: Faculty
```

*Note: These are example credentials. Create real accounts in your backend.*

---

## 🗺️ Key Routes

### Public Routes
| Route | Page | Purpose |
|-------|------|---------|
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |

### Student Routes
| Route | Page | Purpose |
|-------|------|---------|
| `/student/dashboard` | Student Dashboard | Performance overview |
| `/student/exams` | Exam List | Browse available exams |
| `/student/result/:id` | Result Analysis | View exam results |

### Faculty Routes
| Route | Page | Purpose |
|-------|------|---------|
| `/faculty/dashboard` | Faculty Dashboard | Class overview |
| `/faculty/class/:id/analytics` | Class Analytics | Student performance |

---

## 🎯 Main Features at a Glance

### For Students
✅ Login/Register  
✅ Browse exams  
✅ Take exams with timer  
✅ View results and analysis  
✅ Check strengths/weaknesses  

### For Faculty
✅ Login/Register  
✅ View class performance  
✅ Analyze student performance  
✅ Identify learning gaps  
✅ See performance trends  

---

## 🔧 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Eject configuration (irreversible)
npm eject
```

---

## 📋 API Integration Checklist

Before running the app, ensure:

- [ ] Backend server is running
- [ ] `REACT_APP_API_URL` matches backend URL
- [ ] CORS is enabled on backend
- [ ] All required endpoints are implemented
- [ ] Database is set up and migrations are done
- [ ] Test data has been seeded

---

## 🔒 Authentication Flow

```
1. User opens app → Redirected to /login (if not authenticated)
2. User logs in → AuthContext stores token and user data
3. Token added to all API requests automatically
4. User redirected to role-specific dashboard
5. If token expires → Auto logout and redirect to login
```

---

## 💾 LocalStorage Keys

The app uses these localStorage keys:

```javascript
authToken          // JWT authentication token
userData           // User profile information
studentResponses   // Draft exam responses
examDraft          // In-progress exam data
```

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /"
**Solution**: Start development server with `npm start`

### Issue: API calls failing with 401
**Solution**: Check if backend is running and token is valid

### Issue: CORS errors in console
**Solution**: Enable CORS on backend for frontend origin

### Issue: Charts not rendering
**Solution**: Verify data structure and ensure data is not empty

### Issue: Styles look broken
**Solution**: Clear browser cache and restart dev server

---

## 📊 File Organization Quick Reference

```
src/
├── components/       ← Reusable UI components
├── pages/           ← Full page components
├── context/         ← State management
├── services/        ← API calls
├── routes/          ← Routing configuration
├── utils/           ← Constants and helpers
├── assets/          ← Images, icons, styles
├── App.jsx          ← Main component
└── index.js         ← Entry point
```

---

## 🎨 Customization

### Change Primary Color
Edit `index.css`:
```css
:root {
  --primary-color: #YOUR_COLOR;
}
```

### Add New Page
1. Create component in `src/pages/`
2. Add route in `src/routes/AppRoutes.jsx`
3. Link from navigation

### Add New Service
1. Create file in `src/services/`
2. Use `api.js` for HTTP calls
3. Export functions for components

---

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### AWS S3
```bash
npm run build
aws s3 sync build/ s3://your-bucket/
```

---

## 📞 Developer Tips

### Enable Debug Logging
Add to API calls:
```javascript
console.log('Request:', config);
console.log('Response:', response);
```

### Test Components Locally
Use Storybook (if configured):
```bash
npm run storybook
```

### Check Bundle Size
```bash
npm run build -- --analyze
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check API calls and responses

---

## ✅ Pre-Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] Authentication flow tested
- [ ] Exam submission working
- [ ] Analytics displaying correctly
- [ ] Responsive design verified
- [ ] All routes accessible
- [ ] Error handling working
- [ ] Console has no errors

---

## 📚 Quick Links

- [React Documentation](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Recharts Documentation](https://recharts.org)

---

## 🎓 What to Study

1. **React Hooks** - useState, useEffect, useContext
2. **React Router** - Navigation and route protection
3. **Axios** - HTTP requests and interceptors
4. **Context API** - State management pattern
5. **CSS Flexbox/Grid** - Responsive layouts

---

## 💡 Common Tasks

### Add a New Component
```javascript
// src/components/MyComponent.jsx
export const MyComponent = ({ prop1 }) => {
  return <div>{prop1}</div>;
};
export default MyComponent;
```

### Call an API
```javascript
// In a component
import examService from '../services/examService';

const result = await examService.getAllExams();
```

### Use AuthContext
```javascript
// In a component
import { useAuth } from '../context/AuthContext';

const { user, logout } = useAuth();
```

### Add a Route
```javascript
// In AppRoutes.jsx
<Route path="/new-page" element={<NewPage />} />
```

---

## 🔗 Important Contacts

For issues or questions:
1. Check documentation files
2. Review code comments
3. Check error messages in console
4. Test with sample data
5. Verify API endpoints

---

## ✨ You're All Set!

Your ExamPlatform frontend is ready to use. Start the dev server and begin integrating with your backend!

**Questions?** Refer to the detailed documentation:
- `IMPLEMENTATION_GUIDE.md` - Setup details
- `PROJECT_SUMMARY.md` - Complete overview
- `FILE_STRUCTURE.md` - Code organization
- Code comments - In-file documentation

**Happy coding! 🎉**
