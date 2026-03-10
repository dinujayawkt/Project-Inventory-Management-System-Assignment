# Inventory Management System - Frontend

## Project Overview

This is a Next.js 16 + React 19 frontend for the **Inventory Management System** built for **Ceyntics Systems (Pvt) Ltd**. The application provides a secure web interface for managing inventory, storage locations, borrowing records, and audit logs.

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Frontend Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Authentication**: JWT (Sanctum) via localStorage
- **State Management**: React Context API

## Project Structure

```
client/
├── app/
│   ├── (auth)/
│   │   ├── layout.js          # Auth layout (no sidebar)
│   │   └── login/
│   │       └── page.js        # Login page
│   ├── (dashboard)/
│   │   ├── layout.js          # Main dashboard layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.js        # Dashboard home
│   │   ├── cupboards/
│   │   │   └── page.js        # Cupboard management
│   │   ├── places/
│   │   │   └── page.js        # Place management
│   │   ├── items/
│   │   │   └── page.js        # Item management
│   │   ├── borrowing/
│   │   │   └── page.js        # Borrow/Return system
│   │   ├── activity-logs/
│   │   │   └── page.js        # Activity log viewer
│   │   └── users/
│   │       └── page.js        # User management (admin only)
│   ├── layout.js              # Root layout with AuthProvider
│   ├── page.js                # Root page (redirects to login or dashboard)
│   └── globals.css            # Global styles
├── components/
│   └── UI.js                  # Reusable UI components (Modal, Alert, Button, etc.)
├── context/
│   └── AuthContext.js         # Authentication context provider
├── lib/
│   ├── api.js                 # Axios configuration and interceptors
│   ├── authService.js         # Auth API calls
│   ├── cupboardService.js     # Cupboard CRUD API calls
│   ├── placeService.js        # Place CRUD API calls
│   ├── itemService.js         # Item CRUD API calls
│   ├── borrowService.js       # Borrow/Return API calls
│   └── activityLogService.js  # Activity log API calls
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.js
├── .env.local.example         # Environment variables template
└── README.md
```

## Features Implemented

### 1. **Authentication** ✓
- Login page with email and password
- No public registration (admin-only user creation)
- JWT token management via localStorage
- Auto-redirect based on authentication status
- Automatic logout on 401 response

### 2. **Dashboard** ✓
- Statistics cards showing total cupboards, places, items, and borrowed items
- Quick navigation to main features
- User welcome with role display

### 3. **Cupboard Management** ✓
- View all cupboards
- Create new cupboards
- Edit cupboard names
- Delete cupboards
- Created date tracking

### 4. **Place Management** ✓
- View all places with associated cupboards
- Create places within cupboards
- Edit places
- Delete places
- Hierarchical organization (Cupboard → Place)

### 5. **Item Management** ✓
- Complete CRUD operations for inventory items
- Item fields:
  - Name, Code (unique), Quantity
  - Serial Number (optional)
  - Description
  - Storage Location (Place)
  - Status (In-Store, Borrowed, Damaged, Missing)
  - Image (optional)
- Quantity adjustment (add/subtract)
- Status color-coding
- Real-time quantity checks

### 6. **Borrowing System** ✓
- Borrow items with:
  - Item selection
  - Borrower name and contact
  - Quantity tracking
  - Borrow and expected return dates
- Automatic stock reduction on borrow
- Return functionality with stock restoration
- Separate tabs for:
  - Currently borrowed items
  - Returned items history

### 7. **Activity Logs** ✓
- Complete audit trail of all system activities
- Logged actions: created, updated, deleted, borrowed, returned
- Shows user who performed action, timestamp
- Before/after value comparison
- Filterable by entity type and action
- Timeline view with icons and color coding

### 8. **User Management** ✓
- Admin-only feature
- Create new users with roles (Admin/Staff)
- View all users
- Password hashing handled by backend
- Role-based access control

### 9. **UI/UX Features** ✓
- Responsive dashboard layout with collapsible sidebar
- Role-based route visibility
- Error and success alerts
- Loading states and spinners
- Modal dialogs for forms
- Confirmation dialogs for destructive actions
- Graceful error handling with user-friendly messages
- Real-time form validation

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

1. **Clone the repository**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your API URL (default is already set for local development)
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## API Integration

### Base URL Configuration
The API base URL is configured in `lib/api.js`:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

Change this in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Authentication Flow

1. User logs in with email and password
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token automatically added to all API requests via interceptor
5. On 401 response, user is logged out and redirected to login

### Interceptors

The Axios instance in `lib/api.js` handles:
- **Request Interceptor**: Automatically adds Bearer token to headers
- **Response Interceptor**: Catches 401 errors and redirects to login

## Component Architecture

### AuthContext
- Manages global authentication state
- Provides `useAuth()` hook for consuming components
- Handles login/logout
- Checks for admin role

### UI Components
Reusable components in `components/UI.js`:
- `Modal`: Dialog for forms and confirmations
- `Alert`: Display error/success/info messages
- `LoadingSpinner`: Loading state indicator
- `Button`: Standardized button with variants

### Service Layer
Each resource has its own service file:
- `authService`: Auth endpoints
- `cupboardService`: Cupboard CRUD
- `placeService`: Place CRUD
- `itemService`: Item CRUD + quantity management
- `borrowService`: Borrow/Return operations
- `activityLogService`: Activity log retrieval

## Key Implementation Details

### 1. Role-Based Access Control
```javascript
// In dashboard layout
const isAdmin = user?.role === 'admin';

// Users page is only visible to admins
if (currentUser?.role !== 'admin') {
  router.push('/dashboard');
}
```

### 2. Quantity Management
Items have two ways to update quantity:
- Direct edit (via modal)
- Increment/decrement buttons for quick adjustments

### 3. Borrowing Logic
- When borrowing: quantity is automatically deducted from item stock
- When returning: quantity is automatically restored

### 4. Activity Logging
All changes are logged by the backend. Frontend displays:
- Action type (with emoji icon)
- User who performed action
- Timestamp
- Previous → New values

### 5. Error Handling
- API errors are caught and displayed as user-friendly alerts
- Form validation on client-side
- Server errors from backend are shown to user
- Unauthorized access triggers automatic logout

## Environment Variables

Create `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional: Add more variables as needed
```

## Testing Credentials

Ask your admin user for credentials to log in. The system does not allow self-registration.

## Security Features

✓ **JWT Authentication**: Secure token-based authentication  
✓ **Role-Based Authorization**: Admin-only features restricted  
✓ **Automatic Logout**: On 401 unauthorized responses  
✓ **Token Storage**: Secure localStorage usage with server-side validation  
✓ **CORS**: Handled by backend  
✓ **Input Validation**: Client and server-side validation  

## Common Issues

### API Connection Failed
- Ensure Laravel backend is running on `http://localhost:8000`
- Check `.env.local` API URL configuration
- Check CORS settings in Laravel

### Login Not Working
- Verify backend is running
- Check credentials in backend database
- Inspect browser console for error messages

### 401 Unauthorized
- Token may be expired (clear localStorage and log in again)
- User may not have permission for the resource
- Check user role and feature visibility

## Development Notes

### Adding New Pages
1. Create folder in `app/(dashboard)/`
2. Create `page.js` with 'use client' directive
3. Add navigation link in dashboard layout
4. Create corresponding service in `lib/` if needed

### Adding New API Endpoints
1. Create service file in `lib/`
2. Use the `api` instance from `lib/api.js`
3. Export functions that call endpoints
4. Use in components with error handling

### Styling
- Uses Tailwind CSS 4
- Custom colors via Tailwind classes
- Responsive design with Tailwind's grid and flexbox
- No additional CSS files needed for most components

## Performance Optimizations

- Lazy loading of pages (Next.js automatic)
- Image optimization (when implemented)
- API request memoization (React state)
- Efficient re-renders (Context API)

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)
```bash
# Push code to GitHub
# Connect repository to Vercel
# Set environment variable NEXT_PUBLIC_API_URL in Vercel dashboard
# Automatic deployment on push
```

### Other Platforms
```bash
# Build
npm run build

# Start
npm start
```

## Support & Debugging

### Enable Debug Logs
Uncomment console.log statements in service files or components

### Check Network Requests
- Open browser DevTools → Network tab
- Check API responses and headers
- Verify Bearer token in Authorization header

### Check Local Storage
- DevTools → Application → Local Storage
- Verify 'token' and 'user' keys are present

## Future Enhancements

- [ ] Image upload for items
- [ ] Batch operations
- [ ] Advanced filtering and search
- [ ] Export to CSV/PDF
- [ ] Dark mode
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Email alerts for overdue returns

## License

Proprietary software for Ceyntics Systems (Pvt) Ltd

## Author

Frontend implementation by: [Your Name]  
Project Timeline: 3 Days (06/03/2026)

---

**Last Updated**: March 10, 2026  
**Version**: 1.0.0
