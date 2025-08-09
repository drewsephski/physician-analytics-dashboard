import { CourseDashboard } from '@/components/course-dashboard';

export default function CoursesPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Learning Progress</h1>
          <p className='text-muted-foreground'>
            Track your progress through the physician analytics training modules
          </p>
        </div>

        <CourseDashboard />
      </div>
    </div>
  );
}
