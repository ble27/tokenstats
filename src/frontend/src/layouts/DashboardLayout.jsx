import WorkspaceNav from '../components/dashboard/WorkspaceNav';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import WorkspaceView from '../components/workspace/WorkspaceView';
import AnalyticsView from '../components/analytics/AnalyticsView';
import { useWorkspaceTab } from '../hooks/useWorkspaceTab';

const DashboardLayout = ({ userEmail, onSignOut, initialTab }) => {
  const { tab, setTab } = useWorkspaceTab(initialTab);

  return (
    <div className="dashboard-shell">
      <WorkspaceNav activeTab={tab} onTabChange={setTab} />
      <div className="dashboard-main">
        <DashboardHeader activeTab={tab} userEmail={userEmail} onSignOut={onSignOut} />
        <div className="dashboard-content">
          {tab === 'analytics' ? <AnalyticsView /> : <WorkspaceView />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
