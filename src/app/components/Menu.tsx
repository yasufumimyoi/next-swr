'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { fetchMenuBadges } from '@/lib/api';
import { MenuBadges } from '@/types/badge';

const badgeColors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
};

export function Menu() {
  const pathname = usePathname();
  const { data: badges, error, isLoading } = useSWR<MenuBadges>('menu-badges', fetchMenuBadges, {
    refreshInterval: 10000, // 10秒ごとに更新
  });

  const menuItems = [
    { href: '/', label: 'ホーム', badge: badges?.home ?? null },
    { href: '/dashboard', label: 'ダッシュボード', badge: badges?.dashboard ?? null },
    { href: '/settings', label: '設定', badge: badges?.settings ?? null },
  ];

  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center justify-between p-2 hover:bg-gray-200 rounded ${
                  pathname === item.href ? 'bg-gray-200' : ''
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`${badgeColors[item.badge.color]} text-white text-xs px-2 py-1 rounded-full`}
                  >
                    {item.badge.type === 'new' ? '新着' : item.badge.count > 0 ? item.badge.count : ''}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}