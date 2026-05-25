import { useCallback, useEffect, useState } from 'react';
import { goToWorkspace, goToWorkspaceAnalytics, tabFromPathname } from '../lib/navigation';

export function useWorkspaceTab(initialTab) {
  const [tab, setTabState] = useState(() => initialTab || tabFromPathname(window.location.pathname) || 'workspace');

  useEffect(() => {
    const sync = () => {
      const next = tabFromPathname(window.location.pathname);
      if (next) setTabState(next);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    if (initialTab && initialTab !== tab) {
      setTabState(initialTab);
    }
  }, [initialTab]);

  const setTab = useCallback((nextTab) => {
    setTabState(nextTab);
    if (nextTab === 'analytics') {
      goToWorkspaceAnalytics();
    } else {
      goToWorkspace();
    }
  }, []);

  return { tab, setTab, isWorkspace: tab === 'workspace', isAnalytics: tab === 'analytics' };
}
