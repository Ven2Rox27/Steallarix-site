// ============================================================
// Stellarix — App Shell (Navbar + Search)
// ============================================================

import { useState } from 'react';
import Navbar from './Navbar/Navbar';
import SearchOverlay from './Search/SearchOverlay';

interface AppShellProps {
  currentPath?: string;
}

export default function AppShell({ currentPath }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Navbar
        currentPath={currentPath}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
