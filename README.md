# Quiz Maker Frontend

A React frontend application for the Quiz Maker platform, built with modern technologies and clean architecture.

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Redux Toolkit** - State Management
- **React Query (TanStack Query)** - Server State Management
- **Styled Components** - CSS-in-JS Styling
- **React Router** - Client-side Routing
- **Axios** - HTTP Client

## Architecture

This project follows Clean Architecture principles with the following structure:

```
src/
├── app/                 # Application layer (main setup, routing, theme)
├── domain/             # Business logic and entities
│   ├── entities/       # Data models
│   └── repositories/   # Repository interfaces
├── infrastructure/     # External services and implementations
│   ├── config/         # Configuration (axios, environment)
│   └── repositories/   # Repository implementations
├── presentation/       # UI layer
│   ├── components/     # React components
│   ├── pages/         # Page components
│   └── hooks/         # Custom hooks
├── shared/            # Shared utilities and types
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
└── store/             # Redux store configuration
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:4000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Features

- ✅ Modern React with TypeScript
- ✅ Clean Architecture structure
- ✅ Redux Toolkit for state management
- ✅ React Query for server state
- ✅ Styled Components for styling
- ✅ React Router for navigation
- ✅ Axios for API calls
- ✅ Environment configuration
- ✅ Development tools (ESLint, Prettier, Jest)
- ✅ Bundle optimization with Vite

## Backend Integration

This frontend connects to the Quiz Maker backend API. Make sure the backend is running on `http://localhost:4000` (or update the `VITE_API_BASE_URL` environment variable).

## Contributing

1. Follow the established architecture patterns
2. Use TypeScript for type safety
3. Write tests for new features
4. Follow the existing code style
5. Update documentation as needed