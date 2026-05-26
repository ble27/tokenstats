const WorkspaceIcon = () => (
  <svg className="workspace-nav__icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M4 6h16v12H7l-3 3V6h14Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="workspace-nav__icon" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M4 19V5M10 19V9M16 19v-6M22 19V3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const NAV_ITEMS = [
  { id: 'workspace', label: 'Workspace', Icon: WorkspaceIcon },
  { id: 'analytics', label: 'Analytics', Icon: AnalyticsIcon },
];

const WorkspaceNav = ({ activeTab, onTabChange }) => (
  <nav className="workspace-nav" aria-label="Dashboard">
    <p className="workspace-nav__brand">Tokenstats</p>
    <ul className="workspace-nav__list">
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <li key={id}>
          <button
            type="button"
            className={`workspace-nav__item${activeTab === id ? ' workspace-nav__item--active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon />
            {label}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

export default WorkspaceNav;
