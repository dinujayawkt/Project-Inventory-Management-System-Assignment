# Frontend Setup & Quick Start Guide

## ⚡ Quick Start (2 minutes)

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure API URL
Create `.env.local` file:
```bash
# Copy the example
cp .env.local.example .env.local

# For local development, the default URL should work:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Login
- Use credentials provided by your admin
- No self-registration allowed
- Contact admin for account creation

---

## 📁 Project Structure Overview

```
lib/                    → API service layer (all backend communication)
context/               → React Context for authentication state
components/            → Reusable UI components
app/(auth)/            → Login page (no sidebar)
app/(dashboard)/       → Main dashboard pages (with sidebar)
  ├── dashboard/       → Home page with stats
  ├── cupboards/       → Manage cupboards
  ├── places/          → Manage places
  ├── items/           → Manage inventory items
  ├── borrowing/       → Borrow/Return system
  ├── activity-logs/   → Audit trail
  └── users/           → User management (admin only)
```

---

## 🔐 Authentication

All API requests require a valid JWT token. The token is:
1. Obtained during login
2. Automatically stored in localStorage
3. Automatically sent with every request
4. Automatically cleared on logout

**Initial Admin Account**: Ask your administrator for login credentials

---

## 📊 Main Features

### Dashboard
- Statistics overview
- Quick navigation links
- Current user info

### Inventory Management
- **Cupboards**: Storage containers
- **Places**: Locations within cupboards
- **Items**: Individual inventory items
  - Name, Code (unique), Quantity
  - Serial number, Description
  - Location, Status (In-Store/Borrowed/Damaged/Missing)

### Borrowing System
- Record item borrowing
- Track returnable items
- Auto stock adjustment
- Borrower details and dates

### Activity Logs
- Complete audit trail
- Filter by type and action
- Before/after value tracking
- User and timestamp

### User Management (Admin Only)
- Create new users
- Assign roles (Admin/Staff)
- View all users

---

## 🛠️ Development Commands

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🌐 API Configuration

The API URL is configured via environment variables:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### For Different Environments:

**Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Staging:**
```env
NEXT_PUBLIC_API_URL=https://staging-api.example.com/api
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

---

## 📝 Common Tasks

### Create a New User (Admin)
1. Go to Users page
2. Click "+ New User"
3. Enter name, email, password, role
4. Click Create

### Add an Item to Inventory
1. Go to Items page
2. Click "+ New Item"
3. Fill in name, code, quantity, location
4. Optionally add serial number, description, status
5. Click Create

### Borrow an Item
1. Go to Borrowing page
2. Click "+ Borrow Item"
3. Select item, enter borrower details
4. Set borrow and return dates
5. Click Borrow

### Return an Item
1. Go to Borrowing page
2. In "Currently Borrowed" tab
3. Click "Mark Returned" button
4. Stock is automatically restored

### View Audit Trail
1. Go to Activity Logs page
2. Filter by entity type (Item, User, etc.)
3. Filter by action (Created, Updated, etc.)
4. View details including before/after values

---

## 🐛 Troubleshooting

### Can't connect to API
- ✓ Is backend running? (`php artisan serve`)
- ✓ Is backend on port 8000?
- ✓ Check `.env.local` API URL
- ✓ Check browser Network tab for errors

### Login fails
- ✓ Is backend database migrated?
- ✓ Are credentials correct?
- ✓ Check backend logs

### Pages showing "Loading..." then blank
- ✓ Check browser console for errors
- ✓ Check Network tab → see if API calls succeed
- ✓ Ensure you're authenticated (token in localStorage)

### 401 Unauthorized errors
- ✓ Your token may be expired
- ✓ Clear localStorage: DevTools → Application → Local Storage → Clear All
- ✓ Log in again

---

## 📦 Dependencies

Main packages:
- **next**: React framework
- **react**: UI library
- **axios**: HTTP client
- **tailwindcss**: Styling
- **eslint**: Code quality

Install new packages:
```bash
npm install package-name
```

---

## 🚀 Deployment

### To Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` in environment variables
4. Deploy

### To Traditional Server
```bash
npm run build
npm start
```

Server will run on port 3000 by default.

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

For API documentation, see `FRONTEND_README.md` or backend documentation.

---

## ❓ Need Help?

1. Check the browser console for error messages
2. Check the Network tab in DevTools to see API responses
3. Review error alerts displayed in the application
4. Contact your administrator if API is down
5. Check backend logs if API is returning errors

---

**Ready to use!** The frontend is fully integrated with the backend API.
