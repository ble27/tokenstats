export const HOME_PATH = '/';
export const WORKSPACE_PATH = '/workspace';
export const WORKSPACE_ANALYTICS_PATH = '/workspace/analytics';

export const WORKSPACE_TABS = {
  workspace: WORKSPACE_PATH,
  analytics: WORKSPACE_ANALYTICS_PATH,
};

export function tabFromPathname(pathname) {
  if (pathname === WORKSPACE_ANALYTICS_PATH || pathname.startsWith(`${WORKSPACE_ANALYTICS_PATH}/`)) {
    return 'analytics';
  }
  if (pathname === WORKSPACE_PATH || pathname.startsWith(`${WORKSPACE_PATH}/`)) {
    return 'workspace';
  }
  return null;
}

export function pathForTab(tab) {
  return tab === 'analytics' ? WORKSPACE_ANALYTICS_PATH : WORKSPACE_PATH;
}

export function navigateTo(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export const goToWorkspace = () => navigateTo(WORKSPACE_PATH);
export const goToWorkspaceAnalytics = () => navigateTo(WORKSPACE_ANALYTICS_PATH);
export const goToHome = () => navigateTo(HOME_PATH);

export function isWorkspacePath(pathname) {
  return pathname === WORKSPACE_PATH || pathname.startsWith(`${WORKSPACE_PATH}/`);
}
