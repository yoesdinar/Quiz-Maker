# Quiz Maker Frontend

A comprehensive React-based quiz platform featuring real-time anti-cheat monitoring, timed assessments, and detailed result analytics. Built with modern web technologies and clean architecture principles.

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Quiz Maker Backend** running on port 4000

### Running the Application Locally

1. **Clone and navigate to the project:**
   ```bash
   git clone git@github.com:yoesdinar/Quiz-Maker.git
   cd quiz-maker-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file in the root directory
   # insert these 2 lines: 
      VITE_API_BASE_URL=http://localhost:4000
      VITE_API_TOKEN=dev-token
   ```

4. **Start the backend server** (in a separate terminal):
   ```bash
   cd ../hiring-quiz-maker-backend-main
   npm install
   npm run dev
   ```

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

### API Authentication
All API requests include the header `Authorization: Bearer dev-token` for development purposes.

## 🛠 Tech Stack

- **React 18** - UI Library with Hooks and Concurrent Features
- **TypeScript** - Type Safety and Enhanced Developer Experience  
- **Vite** - Lightning-fast Build Tool and Dev Server
- **TanStack Query v5** - Server State Management and Caching
- **Redux Toolkit** - UI State Management (navigation, timer, anti-cheat)
- **Styled Components** - CSS-in-JS with Theme Support
- **React Router v6** - Client-side Routing
- **Axios** - HTTP Client with Interceptors

## 🏗 Architecture & Design Decisions

### Clean Architecture Pattern
This project implements Clean Architecture with clear separation of concerns:

```
src/
├── app/                    # Application layer (routing, providers, global config)
├── domain/                 # Business logic (entities, repository interfaces)
├── infrastructure/         # External services (API clients, TanStack Query setup)
├── presentation/           # UI layer (components, pages, custom hooks)
├── shared/                # Shared utilities, types, constants
└── store/                 # State management (Redux slices, query hooks)
```

### Key Architecture Decisions

#### 1. **Hybrid State Management Approach**
- **TanStack Query v5**: Server state management (API calls, caching, background refetching)
- **Redux Toolkit**: UI state management (navigation, timer, user answers, anti-cheat events)

**Trade-offs:**
- ✅ **Pros**: Clear separation of server vs UI state, automatic caching, optimistic updates
- ⚠️ **Cons**: Additional complexity, two state management paradigms to learn

#### 2. **Repository Pattern Implementation**
```typescript
// Domain layer defines contracts
interface IAttemptRepository {
  createAttempt(request: CreateAttemptRequest): Promise<AttemptResult>;
}

// Infrastructure layer implements contracts
class AttemptRepository implements IAttemptRepository {
  // Implementation details...
}
```

**Trade-offs:**
- ✅ **Pros**: Testable, swappable implementations, clear dependencies
- ⚠️ **Cons**: More boilerplate, abstraction overhead for simple CRUD operations

#### 3. **Component Architecture**
- **Styled Components**: Theme-based styling with TypeScript support
- **Custom Hooks**: Business logic extraction (e.g., `useAntiCheatTracking`)
- **Container/Presentation Pattern**: Smart components handle state, dumb components handle display

#### 4. **Real-time Features**
- **Timer Implementation**: Redux-based countdown with automatic quiz submission
- **Anti-cheat Monitoring**: Event-driven detection with immediate local logging + async backend sync

**Trade-offs:**
- ✅ **Pros**: Immediate user feedback, resilient to network issues
- ⚠️ **Cons**: Potential state synchronization challenges, battery usage on mobile

## 🛡 Anti-Cheat Implementation

### Overview
The application implements comprehensive anti-cheat monitoring during quiz sessions to maintain assessment integrity.

### What We Monitor

#### 1. **Focus Loss Detection**
```typescript
// Events logged when user switches away from quiz
{
  eventType: 'focus_lost',
  reason: 'window_blur' | 'page_hidden' | 'tab_switch',
  timestamp: '2025-11-02T12:00:00.000Z',
  attemptId: 123
}
```

#### 2. **Focus Restoration**
```typescript
// Events logged when user returns to quiz
{
  eventType: 'focus_gained', 
  reason: 'window_focus' | 'page_visible',
  timestamp: '2025-11-02T12:01:30.000Z',
  attemptId: 123
}
```

#### 3. **Copy-Paste Detection**
```typescript
// Events logged when user pastes content into answer fields
{
  eventType: 'paste_detected',
  inputType: 'short_answer' | 'mcq',
  contentLength: 142,
  timestamp: '2025-11-02T12:05:15.000Z',
  attemptId: 123
}
```

### Where Events Are Logged

#### Frontend (Immediate)
- **Redux Store**: Local state for real-time UI updates
- **React Components**: Live counters and warnings displayed to user
- **Browser Console**: Debug information during development

#### Backend (Asynchronous)
- **Database**: Persistent storage via `POST /attempts/:id/events`
- **Event Schema**: 
  ```sql
  CREATE TABLE attempt_events (
    id INTEGER PRIMARY KEY,
    attempt_id INTEGER,
    event_type TEXT,
    timestamp TEXT,
    metadata JSON
  );
  ```

### Implementation Details

#### Event Detection Hook
```typescript
// Custom hook handles all anti-cheat monitoring
export const useAntiCheatTracking = () => {
  // Automatic focus/blur detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordEvent('focus_lost', { reason: 'page_hidden' });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Manual paste detection (called by input components)
  const trackPasteEvent = useCallback((inputType, content) => {
    recordEvent('paste_detected', { inputType, contentLength: content.length });
  }, []);
};
```

#### Resilient Logging Strategy
1. **Immediate Local Storage**: Events saved to Redux immediately
2. **Background Sync**: TanStack Query mutations handle backend logging
3. **Failure Handling**: Failed API calls don't block user experience
4. **Batch Processing**: Multiple events can be sent together (future enhancement)

### Privacy & Ethics
- **Minimal Data**: Only behavioral events, no screen recording or keystroke logging
- **Transparent**: Users are informed about monitoring through UI indicators
- **Proportional**: Monitoring level matches assessment stakes
- **Secure**: All events transmitted over HTTPS with authentication

### Results Display
Anti-cheat summary shown in quiz results:
```typescript
// Example summary displayed to user
{
  totalEvents: 7,
  focusLostCount: 3,
  pasteCount: 1,
  events: [ /* detailed event list */ ]
}
```

## 🎯 Key Features

### Quiz Taking Experience
- ✅ **Timed Assessments**: Countdown timer with visual warnings and auto-submission
- ✅ **Multiple Question Types**: Multiple choice and short answer support
- ✅ **Progress Tracking**: Visual progress bar and question navigation
- ✅ **Auto-Save**: Answers automatically saved as user types/selects
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

### Assessment Integrity  
- ✅ **Real-time Anti-Cheat**: Focus tracking and paste detection
- ✅ **Event Logging**: Comprehensive backend logging of suspicious activities
- ✅ **Visual Indicators**: Users see anti-cheat status and warnings
- ✅ **Detailed Results**: Per-question breakdown with correctness analysis

### Developer Experience
- ✅ **TypeScript**: Full type safety across the application
- ✅ **Hot Module Replacement**: Instant feedback during development
- ✅ **Clean Architecture**: Testable, maintainable code structure
- ✅ **Modern Tooling**: Vite, ESLint, Prettier, and more

## 🚦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript compiler checks |

## 🔧 Environment Configuration

### Development (.env)
```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_TITLE=Quiz Maker
```

### Production 
```bash
VITE_API_BASE_URL=https://api.quizmaker.com
VITE_APP_TITLE=Quiz Maker Pro
```

## 🌐 Backend Integration

### API Endpoints Used
- `POST /attempts` - Create new quiz attempt
- `POST /attempts/:id/answer` - Submit individual answers  
- `POST /attempts/:id/submit` - Complete quiz and get results
- `POST /attempts/:id/events` - Log anti-cheat events
- `GET /quizzes/:id` - Fetch quiz data for taking

### Authentication
All requests include `Authorization: Bearer dev-token` header for development.

## 📊 Performance Considerations

- **Bundle Size**: Optimized with Vite's tree-shaking and code splitting
- **API Caching**: TanStack Query handles intelligent caching and background updates
- **State Management**: Redux for UI state, TanStack Query for server state
- **Memory Management**: Proper cleanup of event listeners and timers

## 🤝 Contributing

### Code Standards
1. **Architecture**: Follow Clean Architecture patterns
2. **TypeScript**: Maintain strict type safety  
3. **Testing**: Write tests for business logic
4. **Styling**: Use Styled Components with theme consistency
5. **Git**: Use conventional commit messages

### Development Workflow
1. Create feature branch from `main`
2. Implement changes following architecture patterns
3. Ensure TypeScript compilation passes
4. Test locally with backend running
5. Submit pull request with detailed description

## 🔍 Troubleshooting

### Common Issues

#### Backend Connection Failed
```bash
# Ensure backend is running on correct port
cd ../hiring-quiz-maker-backend-main
npm run dev
```

#### TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Hot Reload Not Working
```bash
# Restart dev server
npm run dev
```

For additional support, check the browser console for detailed error messages and network activity.
