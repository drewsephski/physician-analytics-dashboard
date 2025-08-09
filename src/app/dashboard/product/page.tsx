import PageContainer from '@/components/layout/page-container';
import { PhysicianAnalyticsPage } from '@/features/physician-analytics/components/physician-analytics-page';

export const metadata = {
  title: 'Physician Discharge Analytics - Comprehensive Data Analysis',
  description:
    'Detailed physician discharge performance analysis with comprehensive statistics and optimization insights'
};

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <PageContainer scrollable={true}>
        <PhysicianAnalyticsPage />
      </PageContainer>
    </div>
  );
}
