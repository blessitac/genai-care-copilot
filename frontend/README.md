# Frontend - GenAI Care Copilot

This directory contains the React frontend application for the GenAI Care Copilot.

## Purpose

The frontend provides a modern, responsive web interface for both clinicians and patients to interact with the GenAI Care Copilot system. It features:

- Role-based access (Clinician vs Patient views)
- Real-time AI-powered insights
- Responsive design for all devices
- Interactive patient data visualization

## Key Files

- **`src/App.tsx`** - Main application component with routing
- **`src/main.tsx`** - Application entry point
- **`src/api.ts`** - API client for backend communication
- **`src/types.ts`** - TypeScript type definitions
- **`src/components/`** - React components directory
- **`package.json`** - Node.js dependencies and scripts
- **`vite.config.ts`** - Vite build configuration
- **`tailwind.config.js`** - TailwindCSS configuration
- **`run.sh`** - Development server run script
- **`Dockerfile`** - Container configuration

## Features

### Role Selector
- Landing page for role selection
- Clean interface for choosing between Clinician and Patient views

### Clinician View
- **Three-panel layout** for efficient workflow
- **Patient List** - Browse all patients with key metrics
- **Patient Details** - Comprehensive patient information display
- **AI Insights** - Generate clinical summaries and recommendations

### Patient View
- **Patient Dashboard** - Personalized patient information
- **Interactive Chat** - Q&A interface with AI copilot
- **Quick Actions** - Common questions and tasks
- **Medication Overview** - Current prescriptions and instructions

## Running the Frontend

### Quick Start
```bash
# Make script executable and run
chmod +x run.sh
./run.sh
```

### Manual Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### With Docker
```bash
# From project root
docker-compose up frontend
```

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint for code quality
- **`./run.sh`** - Development server with environment setup

## Technology Stack

### Core Technologies
- **React 18** - UI library with modern hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### HTTP & Routing
- **Axios** - HTTP client for API requests
- **React Router DOM** - Client-side routing

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## API Integration

The frontend communicates with the backend through these endpoints:

- **GET `/api/patients`** - Load patient list
- **GET `/api/patients/{id}`** - Load patient details
- **POST `/api/generate/clinician-summary`** - Generate AI summaries
- **POST `/api/generate/patient-answer`** - Get AI answers to questions

## Environment Configuration

The frontend automatically detects the backend at `http://localhost:8000` during development. For production deployments, set:

```bash
VITE_API_URL=https://your-backend-domain.com
```

## Responsive Design

The application is fully responsive and optimized for:

- **Desktop** - Full three-panel layout for clinicians
- **Tablet** - Adapted layout with collapsible panels
- **Mobile** - Stacked layout with touch-friendly interactions

## Development Notes

- Hot module replacement (HMR) is enabled for fast development
- TypeScript provides compile-time type checking
- ESLint enforces code quality standards
- TailwindCSS enables rapid UI development
- All components are functional components using React hooks

## Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Platforms
- **Vercel** - Recommended for React applications
- **Netlify** - Alternative static hosting
- **AWS S3 + CloudFront** - Enterprise deployment
- **Docker** - Containerized deployment

## Testing

While the current setup focuses on development, you can add testing with:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

## Performance Optimization

- Vite provides optimized builds with code splitting
- React components use efficient rendering patterns
- TailwindCSS purges unused styles in production
- Axios requests are optimized for minimal data transfer