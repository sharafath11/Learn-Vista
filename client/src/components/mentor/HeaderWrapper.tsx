'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/mentor/live');

  if (hideHeader) return null;

  return <Header />;
}
