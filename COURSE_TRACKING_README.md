# Course Tracking System

A complete course progress tracking system integrated with Vercel KV for persistent storage.

## 🚀 Features

- **Persistent Progress**: User course progress is automatically saved to Vercel KV
- **Real-time Updates**: Progress updates instantly across all components
- **Course Management**: Complete CRUD operations for course data
- **Visual Progress**: Beautiful progress indicators and completion badges
- **User Authentication**: Integrated with Clerk for secure user-specific data
- **Onboarding Integration**: Seamlessly tracks onboarding step completion

## 📁 File Structure

```
src/
├── app/api/courses/
│   ├── route.ts                    # Main course API endpoints
│   └── [courseId]/route.ts         # Individual course operations
├── hooks/
│   └── use-course-progress.ts      # React hook for course management
├── components/
│   ├── course-progress.tsx         # Individual course progress component
│   └── course-dashboard.tsx        # Complete course overview dashboard
├── app/dashboard/courses/
│   └── page.tsx                    # Course dashboard page
└── features/physician-analytics/components/onboarding/
    ├── course-aware-onboarding-provider.tsx  # Enhanced onboarding with course tracking
    └── course-progress-indicator.tsx         # Progress indicator with course data
```

## 🔧 Setup

### 1. Install Dependencies

```bash
pnpm add @vercel/kv
```

### 2. Configure Vercel KV

1. Go to your Vercel dashboard
2. Navigate to Storage > Create Database > KV
3. Copy the environment variables to your `.env.local`:

```env
KV_REST_API_URL=https://****-kv.upstash.io
KV_REST_API_TOKEN=****
KV_REST_API_READ_ONLY_TOKEN=****
```

### 3. Update Navigation

The courses page has been added to the navigation at `/dashboard/courses`.

## 📖 Usage

### Basic Course Tracking

```tsx
import { CourseProgress } from '@/components/course-progress';

<CourseProgress
  courseId='my-course-id'
  courseName='Course Name'
  totalSteps={5}
  currentStep={2}
  autoSave={true}
/>;
```

### Using the Hook

```tsx
import { useCourseProgress } from '@/hooks/use-course-progress';

function MyComponent() {
  const { courses, updateCourseProgress, getCourseProgress } =
    useCourseProgress();

  const handleProgress = async () => {
    await updateCourseProgress('course-id', 75, 3, 4);
  };

  return (
    <div>
      {courses.map((course) => (
        <div key={course.courseId}>
          {course.courseId}: {course.progress}%
        </div>
      ))}
    </div>
  );
}
```

### Enhanced Onboarding

Replace your existing `OnboardingProvider` with `CourseAwareOnboardingProvider`:

```tsx
import { CourseAwareOnboardingProvider } from './onboarding';

<CourseAwareOnboardingProvider>
  {/* Your app content */}
</CourseAwareOnboardingProvider>;
```

## 🎯 API Endpoints

### GET /api/courses

Get all courses for the authenticated user.

**Response:**

```json
{
  "courses": [
    {
      "courseId": "course-1",
      "completedAt": "2024-01-01T00:00:00Z",
      "progress": 75,
      "currentStep": 3,
      "totalSteps": 4
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### POST /api/courses

Update course progress.

**Request:**

```json
{
  "courseId": "course-1",
  "progress": 75,
  "currentStep": 3,
  "totalSteps": 4
}
```

### GET /api/courses/[courseId]

Get specific course progress.

### DELETE /api/courses/[courseId]

Delete/reset course progress.

## 🔄 Data Flow

1. **User Interaction**: User completes a step in onboarding
2. **Auto-save**: `CourseAwareOnboardingProvider` automatically calls `updateCourseProgress`
3. **API Call**: Hook makes POST request to `/api/courses`
4. **Database**: Progress saved to Vercel KV with user ID as key
5. **UI Update**: Local state updated, progress indicators refresh
6. **Persistence**: Data persists across sessions and devices

## 🎨 Components

### CourseProgress

Individual course progress tracker with:

- Progress bar
- Completion badges
- Step counter
- Reset functionality

### CourseDashboard

Complete overview showing:

- Overall progress across all courses
- Individual course status
- Completion statistics
- Course categories

### CourseProgressIndicator

Enhanced progress indicator for onboarding with:

- Real-time course progress
- Section-by-section breakdown
- Quick navigation to incomplete sections
- Completion celebrations

## 🔐 Security

- All API endpoints require Clerk authentication
- User data is isolated by `userId`
- No cross-user data access possible
- Environment variables for secure KV access

## 🚀 Deployment

The system works seamlessly with Vercel deployment:

1. Push your code to your repository
2. Vercel will automatically detect the KV environment variables
3. Course tracking will be immediately available in production

## 📊 Course Definitions

Current courses are defined in `CourseDashboard` component:

- `physician-analytics-overview`: Dashboard Overview
- `physician-analytics-data-table`: Data Analysis
- `physician-analytics-charts`: Visual Analytics
- `physician-analytics-heatmap`: Hourly Patterns
- `physician-analytics-insights`: Performance Insights

## 🎉 Next Steps

1. **Analytics**: Add course completion analytics
2. **Certificates**: Generate completion certificates
3. **Gamification**: Add points, badges, and leaderboards
4. **Notifications**: Email notifications for course milestones
5. **Export**: Export progress reports
6. **Admin Panel**: Course management interface

The system is now fully integrated and ready for users to start tracking their learning progress!
