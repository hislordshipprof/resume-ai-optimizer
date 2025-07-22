# API Integration Architecture Decisions

## Project: Resume AI Frontend-Backend Integration

### Decision Log - Session Date: 2025-01-18

## Decision 1: CORS Resolution Strategy
**Context**: Frontend (React, port 8081) needs to communicate with backend (FastAPI, port 8001)

**Options Considered**:
1. Backend CORS middleware configuration
2. Frontend request header modifications  
3. Vite proxy configuration
4. Backend reverse proxy setup

**Decision**: ✅ **Vite Proxy Configuration**

**Rationale**:
- Most reliable for development environment
- Simpler than backend CORS configuration
- Handles authentication headers correctly
- No production impact (development only)

**Implementation**:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
      secure: false
    }
  }
}
```

**Trade-offs**:
- ✅ Reliable, simple setup
- ✅ No backend changes needed
- ❌ Development-only solution
- ❌ Requires production proxy setup

---

## Decision 2: State Management Architecture
**Context**: Need to manage resume optimization workflow state across multiple components

**Options Considered**:
1. Redux with toolkit
2. Zustand state management
3. React Context API
4. Component prop drilling

**Decision**: ✅ **React Context API (Two-Context Pattern)**

**Rationale**:
- Appropriate complexity for our use case
- Type-safe with TypeScript
- Easy to test and maintain
- Good performance for our scale
- Separation of concerns with multiple contexts

**Implementation**:
```typescript
// ResumeFlowContext: Workflow state
// AuthContext: User authentication
const ResumeFlowContext = createContext<ResumeFlowContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

**Trade-offs**:
- ✅ Simple, no additional dependencies
- ✅ Type-safe implementation
- ✅ Easy to understand and maintain
- ❌ May need refactoring for complex state logic
- ❌ No time-travel debugging like Redux

---

## Decision 3: API Service Layer Pattern
**Context**: Need centralized API management with error handling and authentication

**Options Considered**:
1. Individual API functions in components
2. Centralized API service class
3. Custom hooks for each API endpoint
4. Third-party library (axios, react-query)

**Decision**: ✅ **Centralized API Service Class**

**Rationale**:
- Consistent error handling across all endpoints
- Automatic token management
- Type safety with TypeScript
- Easy to mock for testing
- Single source of truth for API configuration

**Implementation**:
```typescript
class ApiService {
  private baseURL: string;
  private token: string | null = null;
  
  // Centralized methods for all endpoints
  async uploadResume(file: File): Promise<ResumeResponse>
  async analyzeJobDescription(data: JobData): Promise<JobAnalysis>
  // ... other methods
}
```

**Trade-offs**:
- ✅ Consistent error handling
- ✅ Centralized token management
- ✅ Type safety
- ❌ Larger initial setup
- ❌ Less flexible than individual functions

---

## Decision 4: Data Flow Architecture
**Context**: Need to manage sequential API calls with dependencies

**Options Considered**:
1. Manual step-by-step progression
2. Automatic workflow based on data availability
3. Hybrid approach (auto + manual override)
4. State machine pattern

**Decision**: ✅ **Hybrid Approach (Auto + Manual Override)**

**Rationale**:
- Best user experience with automatic progression
- Flexibility to manually control flow
- Handles complex dependencies automatically
- Provides clear feedback during transitions

**Implementation**:
```typescript
// Automatic progression when dependencies are met
useEffect(() => {
  if (resumeData && jobAnalysis && !gapAnalysis && !isAnalyzing) {
    performGapAnalysis();
  }
}, [resumeData, jobAnalysis, gapAnalysis, isAnalyzing]);

// Manual navigation controls
const handleContinueToNextStep = () => setCurrentStep(nextStep);
```

**Trade-offs**:
- ✅ Seamless user experience
- ✅ Flexibility for edge cases
- ✅ Clear dependency management
- ❌ More complex implementation
- ❌ Potential for unexpected behavior

---

## Decision 5: Error Handling Strategy
**Context**: Need consistent error communication across all API interactions

**Options Considered**:
1. Console logging only
2. Alert dialogs for errors
3. Toast notifications
4. Inline error messages
5. Error boundary pattern

**Decision**: ✅ **Toast Notifications + Error Boundaries**

**Rationale**:
- User-friendly, non-blocking error communication
- Consistent presentation across the application
- Allows users to continue working
- Error boundaries catch unexpected errors

**Implementation**:
```typescript
// Transform backend errors to user-friendly messages
toast({
  title: "Upload Failed",
  description: error instanceof Error ? error.message : "Please try again",
  variant: "destructive",
});
```

**Trade-offs**:
- ✅ Non-blocking user experience
- ✅ Consistent error presentation
- ✅ Easy to implement
- ❌ May be missed by users
- ❌ Limited space for detailed error info

---

## Decision 6: Backend ID Storage Strategy
**Context**: Need to store backend entity IDs for subsequent API calls

**Options Considered**:
1. Store in component state
2. Store in URL parameters
3. Store in context/global state
4. Fetch IDs on-demand

**Decision**: ✅ **Store in Context/Global State**

**Rationale**:
- Required for subsequent API calls
- Survives component re-renders
- Centralized access across components
- Type-safe with interface definitions

**Implementation**:
```typescript
interface ParsedResumeData {
  // ... other fields
  backendId?: number; // For subsequent API calls
}

interface JobAnalysisData {
  // ... other fields
  backendId?: number; // For subsequent API calls
}
```

**Trade-offs**:
- ✅ Reliable access across components
- ✅ Type-safe implementation
- ✅ Survives navigation
- ❌ Requires careful state management
- ❌ Potential for stale data

---

## Decision 7: File Upload Implementation
**Context**: Need to handle multipart/form-data file uploads

**Options Considered**:
1. Custom fetch implementation
2. Third-party library (axios)
3. Native FormData API
4. Base64 encoding

**Decision**: ✅ **Custom Fetch + FormData API**

**Rationale**:
- No additional dependencies
- Full control over request handling
- Proper multipart/form-data handling
- Consistent with rest of API service

**Implementation**:
```typescript
async uploadResume(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${this.baseURL}/resumes/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.token}`,
      // Don't set Content-Type - browser handles it
    },
    body: formData,
  });
}
```

**Trade-offs**:
- ✅ No additional dependencies
- ✅ Full control over implementation
- ✅ Proper multipart handling
- ❌ More code to maintain
- ❌ Less features than specialized libraries

---

## Decision 8: Type Safety Strategy
**Context**: Need type safety between backend and frontend data models

**Options Considered**:
1. Use backend types directly
2. Transform backend responses to frontend interfaces
3. Generate types from OpenAPI spec
4. Use any types for flexibility

**Decision**: ✅ **Transform Backend Responses to Frontend Interfaces**

**Rationale**:
- Clear separation between backend and frontend models
- Type safety throughout the application
- Easy to refactor when APIs change
- Self-documenting code

**Implementation**:
```typescript
// Separate interfaces for backend and frontend
interface BackendResumeResponse {
  id: number;
  full_name: string;
  parsed_data: any;
}

interface ParsedResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  backendId?: number;
}

// Transform function
const transformResponse = (backend: BackendResumeResponse): ParsedResumeData => {
  return {
    personalInfo: {
      name: backend.full_name || "Unknown",
      // ... other transformations
    },
    backendId: backend.id
  };
};
```

**Trade-offs**:
- ✅ Type safety throughout application
- ✅ Clear data model separation
- ✅ Easy to refactor
- ❌ Additional transformation code
- ❌ Potential for mapping errors

---

## Decision 9: Component Integration Pattern
**Context**: Need to integrate existing UI components with backend APIs

**Options Considered**:
1. Modify existing components directly
2. Create wrapper components
3. Use higher-order components
4. Use custom hooks for API logic

**Decision**: ✅ **Modify Existing Components + Custom Hooks**

**Rationale**:
- Simplest implementation
- Maintains existing UI structure
- Custom hooks for reusable API logic
- Clear separation of concerns

**Implementation**:
```typescript
// Modified component with API integration
export function EnhancedFileUploader() {
  const { setResumeData, markStepCompleted } = useResumeFlow();
  
  const processFileUpload = async (file: File) => {
    // API integration logic
    const response = await apiService.uploadResume(file);
    setResumeData(transformResponse(response));
    markStepCompleted(1);
  };
}
```

**Trade-offs**:
- ✅ Simple implementation
- ✅ Maintains existing UI
- ✅ Clear component responsibility
- ❌ May create tight coupling
- ❌ Less reusable than HOCs

---

## Decision 10: Authentication Integration
**Context**: Need JWT token management for API calls

**Options Considered**:
1. Manual token management in components
2. Context-based token management
3. HTTP interceptors
4. Third-party auth library

**Decision**: ✅ **Context-Based Token Management**

**Rationale**:
- Consistent with overall architecture
- Type-safe implementation
- Easy to test and maintain
- No additional dependencies

**Implementation**:
```typescript
// AuthContext manages token lifecycle
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API service uses token transparently
private getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (this.token) {
    headers.Authorization = `Bearer ${this.token}`;
  }
  return headers;
}
```

**Trade-offs**:
- ✅ Consistent with architecture
- ✅ Type-safe implementation
- ✅ Easy to maintain
- ❌ Manual token lifecycle management
- ❌ No automatic refresh logic

---

## Decision Summary

| Decision | Choice | Confidence | Impact |
|----------|--------|------------|---------|
| CORS Resolution | Vite Proxy | High | High |
| State Management | React Context | High | High |
| API Service | Centralized Class | High | Medium |
| Data Flow | Hybrid Auto/Manual | Medium | High |
| Error Handling | Toast + Boundaries | High | Medium |
| Backend ID Storage | Context State | High | High |
| File Upload | Custom Fetch | Medium | Low |
| Type Safety | Transform Responses | High | High |
| Component Integration | Direct Modification | Medium | Medium |
| Authentication | Context Management | High | High |

## Lessons Learned

1. **CORS is tricky**: Vite proxy was more reliable than backend configuration
2. **Context is powerful**: React Context handled our state management needs well
3. **Type safety pays off**: TypeScript interfaces prevented many runtime errors
4. **Error handling matters**: Good error UX significantly improves user experience
5. **Sequential APIs need planning**: Storing backend IDs was crucial for the workflow
6. **Testing is essential**: Each integration step needed thorough testing

## Future Decisions Needed

1. **Real-time optimization**: How to handle bullet-by-bullet API calls efficiently
2. **File export**: Strategy for handling binary file downloads
3. **Performance optimization**: Caching and request optimization strategies
4. **Testing strategy**: Integration testing between frontend and backend
5. **Production deployment**: Production-ready API configuration