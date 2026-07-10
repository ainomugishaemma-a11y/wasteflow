# WasteFlow Frontend README

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create `.env` file (optional):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### Development

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

Built files will be in `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout/     # Navbar, Sidebar, Footer
│   │   ├── Dashboard/  # Dashboard components
│   │   ├── Bins/       # Bin monitoring
│   │   ├── Auth/       # Auth components
│   │   └── Notifications/
│   ├── pages/          # Full page components
│   ├── context/        # React Context
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   ├── styles/         # Global styles
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Static files
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── Dockerfile
```

## Key Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Axios**: HTTP client
- **Recharts**: Analytics charts
- **Lucide React**: Icons
- **Zustand**: State management (ready to use)

## Features

### Pages
- Dashboard (stats, charts, analytics)
- Bins Monitoring (real-time status)
- Notifications (system alerts)
- Reports (collections, analytics)
- User Management (admin only)
- Settings (user preferences)

### Components
- Responsive navigation bar
- Collapsible sidebar
- Dashboard cards with stats
- Chart visualizations
- Notification center
- Login form
- Protected routes

### Styling
- Modern healthcare SaaS design
- Green/white/gray theme
- Fully responsive (mobile, tablet, desktop)
- Professional typography
- Hover effects and transitions

## Development

### Add New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation in `src/components/Layout/Sidebar.tsx`

### Add New Component
1. Create in appropriate folder under `src/components/`
2. Use TypeScript and types from `src/types/`
3. Style with Tailwind CSS classes

### API Integration
1. Create service in `src/services/`
2. Use `api` instance from `src/services/api.ts`
3. Handle errors and loading states

### Authentication
- Use `useAuth()` hook to access user and auth functions
- Protected routes use `<ProtectedRoute>` component
- Tokens stored in localStorage

## Styling

### Tailwind CSS Classes Used
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Cards: `card card-hover`
- Buttons: `btn btn-primary btn-sm`
- Badges: `badge badge-success badge-warning badge-danger`
- Responsive: `hidden sm:block md:flex lg:grid`

### Custom Classes (in globals.css)
- `.card`: Card styling
- `.btn`: Button base
- `.badge`: Badge styling
- `.skeleton`: Loading skeleton

## Performance Tips

1. Use React.memo for components that don't change often
2. Lazy load pages with React.lazy()
3. Optimize images (use compressed versions)
4. Use debouncing for search/filter inputs
5. Minimize re-renders with proper state management

## Docker

Build and run with Docker:
```bash
docker build -t wasteflow-frontend .
docker run -p 5173:5173 wasteflow-frontend
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing

TODO: Add test suite with Vitest

## Debugging

1. Use React DevTools extension
2. Check browser console for errors
3. Inspect network requests in DevTools
4. Use `console.log()` for debugging

## Deployment

### Static Hosting (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, AWS S3, etc.
```

### Docker
```bash
docker build -t wasteflow-frontend .
docker run -p 80:5173 wasteflow-frontend
```

## Troubleshooting

### Blank page
- Check browser console for errors
- Verify API URL in `.env`
- Check if backend is running

### API errors
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Inspect network request in DevTools

### Styling issues
- Rebuild Tailwind: `npm run build` includes fresh build
- Check if styles are imported in `main.tsx`
- Clear browser cache

## Improving the App

1. Add real-time updates with WebSocket
2. Add user profile management
3. Add export to PDF for reports
4. Add dark mode toggle
5. Add mobile app with React Native
6. Add push notifications
7. Add advanced filtering/search
8. Add user preferences/theme

## Support

For issues:
1. Check browser console
2. Check network tab in DevTools
3. Verify backend connectivity
4. Check `.env` configuration
