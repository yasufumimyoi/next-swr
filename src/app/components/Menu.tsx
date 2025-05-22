'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import { MenuBadges, Badge } from '@/types/badge';
import { useEffect } from 'react';

const badgeColors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
};

// バッジデータを取得する関数
async function fetchBadges(): Promise<MenuBadges> {
  const response = await fetch('https://api.example.com/badges');
  if (!response.ok) {
    throw new Error('Failed to fetch badges');
  }
  return response.json();
}

// バッジの状態を更新する関数
async function updateBadgeCount(path: string) {
  // 現在のバッジデータを取得
  const currentData = await fetchBadges();
  
  // パスに応じてバッジの数を更新
  let updatedData = { ...currentData };
  if (path === '/dashboard' && currentData.dashboard && currentData.dashboard.count > 0) {
    updatedData.dashboard = {
      ...currentData.dashboard,
      count: currentData.dashboard.count - 1
    } as Badge;
  } else if (path === '/settings' && currentData.settings) {
    updatedData.settings = null;
  }

  // SWRのキャッシュを更新
  await mutate('badges', updatedData, false);
  
  // サーバーに更新を送信
  await fetch('https://api.example.com/badges', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
}

export function Menu() {
  const pathname = usePathname();
  const { data: badges, error, isLoading } = useSWR<MenuBadges>('badges', fetchBadges, {
    refreshInterval: 10000,
  });

  // パスが変更されたときにバッジの状態を更新
  useEffect(() => {
    if (pathname === '/dashboard' || pathname === '/settings') {
      updateBadgeCount(pathname);
    }
  }, [pathname]);

  if (error) {
    return (
      <aside className="w-64 bg-gray-100 p-4">
        <div className="text-red-500 text-sm">エラーが発生しました</div>
      </aside>
    );
  }

  if (!badges) {
    return (
      <aside className="w-64 bg-gray-100 p-4">
        <div className="animate-pulse">Loading...</div>
      </aside>
    );
  }

  const menuItems = [
    { href: '/', label: 'ホーム', badge: badges.home },
    { href: '/dashboard', label: 'ダッシュボード', badge: badges.dashboard },
    { href: '/settings', label: '設定', badge: badges.settings },
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
                    className={`${badgeColors[item.badge.color]} text-white text-xs px-2 py-1 rounded-full ${
                      isLoading ? 'animate-pulse' : ''
                    }`}
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