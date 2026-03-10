# Frontend Setup & Deployment Guide

## 🚀 Quick Start in 3 Steps

### Step 1: Install Dependencies
```bash
cd client
npm install
```

### Step 2: Create Environment File
```bash
cp .env.local.example .env.local
```

### Step 3: Start Development
```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 📋 Complete File Checklist

### ✅ Created Files

#### Pages & Layouts
- `app/page.js` - Root redirect page
- `app/layout.js` - Root layout with AuthProvider
- `app/globals.css` - Global styles
- `app/(auth)/layout.js` - Auth layout (no sidebar)
- `app/(auth)/login/page.js` - Login page ✨
- `app/(dashboard)/layout.js` - Dashboard layout with sidebar ✨
- `app/(dashboard)/dashboard/page.js` - Dashboard home ✨
- `app/(dashboard)/cupboards/page.js` - Cupboards CRUD ✨
- `app/(dashboard)/places/page.js` - Places CRUD ✨
- `app/(dashboard)/items/page.js` - Items CRUD ✨
- `app/(dashboard)/borrowing/page.js` - Borrowing system ✨
- `app/(dashboard)/activity-logs/page.js` - Activity logs ✨
- `app/(dashboard)/users/page.js` - User management ✨

#### Services/API Layer
- `lib/api.js` - Axios configuration + interceptors
- `lib/authService.js` - Authentication API
- `lib/cupboardService.js` - Cupboard CRUD API
- `lib/placeService.js` - Place CRUD API
- `lib/itemService.js` - Item CRUD API
- `lib/borrowService.js` - Borrowing API
- `lib/activityLogService.js` - Activity log API

#### Context & Components
- `context/AuthContext.js` - Authentication state management
- `components/UI.js` - Reusable UI components

#### Configuration
- `package.json` - Updated with axios dependency
- `next.config.mjs` - Enhanced Next.js configuration
- `.env.local.example` - Environment variables template

#### Documentation
- `FRONTEND_README.md` - Comprehensive frontend documentation
- `QUICKSTART.md` - Quick start guide
- `IMPLEMENTATION_SUMMARY.md` - Architecture & design decisions
- `SETUP.md` - This file

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```bash
# Copy template
cp .env.local.example .env.local

# Or create manually with:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Update API URL for Different Environments

**Development (Default)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Staging**
```env
NEXT_PUBLIC_API_URL=https://staging.example.com/api
```

**Production**
```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

---

## 📦 Install & Start

### Full Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Server starts on: **http://localhost:3000**

### Build for Production
```bash
# Build optimization
npm run build

# Start production server
npm start
```

---

## 🔐 First Login

1. **Ensure Backend is Running**: `php artisan serve` (port 8000)
2. **Go to**: [http://localhost:3000](http://localhost:3000)
3. **You'll be redirected to**: [http://localhost:3000/login](http://localhost:3000/login)
4. **Login with**: Admin credentials from your database
5. **Dashboard loads**: You're authenticated!

### Test Accounts
Ask your administrator for test credentials since:
- ❌ No public registration allowed
- ✅ Only admins can create users
- ✅ Backend handles all validation

---

## 📁 Project File Tree

```
client/
├── app/
│   ├── (auth)/
│   │   ├── layout.js
│   │   └── login/
│   │       └── page.js
│   ├── (dashboard)/
│   │   ├── layout.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── cupboards/
│   │   │   └── page.js
│   │   ├── places/
│   │   │   └── page.js
│   │   ├── items/
│   │   │   └── page.js
│   │   ├── borrowing/
│   │   │   └── page.js
│   │   ├── activity-logs/
│   │   │   └── page.js
│   │   └── users/
│   │       └── page.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── lib/
│   ├── api.js
│   ├── authService.js
│   ├── cupboardService.js
│   ├── placeService.js
│   ├── itemService.js
│   ├── borrowService.js
│   └── activityLogService.js
├── context/
│   └── AuthContext.js
├── components/
│   └── UI.js
├── public/
├── package.json
├── package-lock.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.mjs
├── jsconfig.json
├── eslint.config.mjs
├── .env.local.example
├── .env.local (create after installation)
├── FRONTEND_README.md
├── QUICKSTART.md
├── IMPLEMENTATION_SUMMARY.md
└── SETUP.md
```

---

## 🌐 Integration with Backend

### API Endpoints Used

**Authentication**
- `POST /login` - User login
- `POST /create-user` - Create user (admin only)
- `GET /users` - Get all users

**Inventory**
- `GET/POST /cupboards` - Cupboard CRUD
- `GET/POST /places` - Place CRUD
- `GET/POST /items` - Item CRUD

**Borrowing**
- `POST /borrow` - Borrow item
- `POST /return/{id}` - Return item
- `GET /borrow` - Get borrowed items
- `GET /return` - Get returned items

**Audit**
- `GET /activity-logs` - Activity log history

All endpoints except `/login` require `Authorization: Bearer {token}` header.

---

## ✨ Features Implemented

### 🔐 Authentication (Complete)
- ✅ Login with email/password
- ✅ JWT token management
- ✅ Auto-redirect to login if not authenticated
- ✅ Auto-logout on 401
- ✅ Token persistence in localStorage

### 📊 Dashboard (Complete)
- ✅ Statistics overview
- ✅ Quick navigation links
- ✅ User information

### 🗄️ Cupboard Management (Complete)
- ✅ View all cupboards
- ✅ Create cupboard
- ✅ Edit cupboard
- ✅ Delete cupboard

### 📍 Place Management (Complete)
- ✅ View all places
- ✅ Create place (select cupboard)
- ✅ Edit place
- ✅ Delete place

### 📦 Item Management (Complete)
- ✅ View all items with details
- ✅ Create item
- ✅ Edit item
- ✅ Delete item
- ✅ Quantity adjustment (+/-)
- ✅ Status management

### 🔄 Borrowing System (Complete)
- ✅ Borrow item (auto stock reduction)
- ✅ Return item (auto stock restoration)
- ✅ View borrowed items
- ✅ View returned items
- ✅ Track borrower details & dates

### 📋 Activity Logs (Complete)
- ✅ View complete audit trail
- ✅ Filter by entity type
- ✅ Filter by action
- ✅ See before/after values
- ✅ User & timestamp tracking

### 👥 User Management (Complete)
- ✅ View all users (admin only)
- ✅ Create new users (admin only)
- ✅ Assign roles (Admin/Staff)
- ✅ User status display

---

## 🐛 Troubleshooting

### Issue: "Can't connect to API"
**Solution**:
1. Check backend is running: `php artisan serve`
2. Verify port 8000: `netstat -ano | findstr :8000` (Windows)
3. Check `.env.local` API URL
4. Restart both frontend and backend

### Issue: "Login fails"
**Solution**:
1. Check credentials in backend database
2. Verify backend is running
3. Check browser console for error details
4. Ensure database migrations ran: `php artisan migrate`

### Issue: "401 Unauthorized"
**Solution**:
1. Token may be expired
2. Clear localStorage: DevTools → Application → Local Storage → Clear All
3. Log in again
4. Verify user role permissions

### Issue: "Page shows 'Loading...' then blank"
**Solution**:
1. Open browser DevTools → Console tab
2. Check for error messages
3. Go to Network tab and check API responses
4. Verify authentication token exists in Network headers

---

## 📝 Common Operations

### Add a New User (Admin)
1. Click "Users" in sidebar
2. Click "+ New User"
3. Fill: Name, Email, Password (min 6), Role
4. Click "Create User"

### Create Inventory Item
1. Click "Items" in sidebar
2. Click "+ New Item"
3. Fill: Name, Code (unique), Quantity, Place
4. Optional: Serial number, Description, Status
5. Click "Create"

### Borrow an Item
1. Click "Borrowing" in sidebar
2. Click "+ Borrow Item"
3. Select: Item, Quantity, Borrower name, Contact
4. Set: Borrow date, Expected return date
5. Click "Borrow"

### View Activity Logs
1. Click "Activity Logs" in sidebar
2. Filter by Entity Type or Action
3. Click on any log to see before/after values

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to Vercel.com
# 3. Connect GitHub repository
# 4. Set environment variable:
#    NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
# 5. Deploy
```

### Option 2: Traditional Server (Ubuntu)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone <your-repo>
cd client
npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start "npm start" --name inventory-frontend
pm2 save
```

### Option 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

### Get Help
1. Check browser console for errors
2. Check Network tab in DevTools
3. Review FRONTEND_README.md for detailed docs
4. Contact administrator if API is down

---

## ✅ Pre-Deployment Checklist

- [ ] All dependencies installed: `npm install`
- [ ] `.env.local` created with correct API URL
- [ ] Backend API is running
- [ ] Can login with test credentials
- [ ] All pages load without errors
- [ ] CRUD operations work
- [ ] Borrowing system works
- [ ] Activity logs appear
- [ ] User management works (admin only)
- [ ] Error messages display properly
- [ ] Responsive on mobile (test in DevTools)
- [ ] Production build succeeds: `npm run build`

---

## 🎯 Next Steps

1. **Immediate**:
   - Get test credentials from admin
   - Run `npm install`
   - Start frontend & backend
   - Test login

2. **Short Term**:
   - Populate with sample data
   - Test all features
   - Verify activity logs
   - Test on different browsers/devices

3. **Before Launch**:
   - Set production API URL
   - Enable HTTPS
   - Configure domain/subdomain
   - Set up monitoring/alerting
   - Backup database

4. **After Launch**:
   - Monitor error logs
   - Get user feedback
   - Plan enhancement features
   - Optimize performance if needed

---

## 📞 Support

**For Frontend Issues**:
1. Check documentation in FRONTEND_README.md
2. Review error messages in console
3. Check Network requests in DevTools

**For Backend/API Issues**:
- Contact API team
- Check backend logs
- Verify database connection

**For Deployment Issues**:
- Check deployment platform docs
- Verify environment variables
- Check firewall/security groups

---

**Frontend**: Fully Implemented ✅  
**Backend Integration**: Complete ✅  
**Documentation**: Comprehensive ✅  
**Ready for Deployment**: YES ✅

Go ahead and run `npm install && npm run dev` to get started!
