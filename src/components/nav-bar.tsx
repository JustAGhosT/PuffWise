'use client';

import { cn } from '@/lib/utils';
import { Clock, LayoutDashboard, Settings, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80 sm:static sm:border-b sm:border-t-0">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2 sm:justify-start sm:gap-6">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:flex-row sm:gap-2 sm:text-sm',
                isActive
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-zinc-900 dark:text-zinc-50')} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
