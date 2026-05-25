const CRUMBS = {
  workspace: { section: 'Workspace', page: 'Prompt' },
  analytics: { section: 'Analytics', page: 'Overview' },
};

const DashboardHeader = ({ activeTab, userEmail, onSignOut }) => {
  const { section, page } = CRUMBS[activeTab] || CRUMBS.workspace;

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__breadcrumbs" aria-label="Breadcrumb">
        <span className="dashboard-header__crumb">{section}</span>
        <span className="dashboard-header__sep" aria-hidden>
          /
        </span>
        <span className="dashboard-header__crumb dashboard-header__crumb--current">{page}</span>
      </div>
      <div className="dashboard-header__actions">
        {userEmail && <span className="dashboard-header__email">{userEmail}</span>}
        <button type="button" className="dashboard-header__signout focus-ring" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
