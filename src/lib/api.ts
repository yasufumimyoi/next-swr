import { MenuBadges } from '@/types/badge';

// モックデータ
const mockBadges: MenuBadges = {
  home: {
    id: '1',
    count: 0,
    type: 'new',
    color: 'blue',
  },
  dashboard: {
    id: '2',
    count: 3,
    type: 'notification',
    color: 'red',
  },
  settings: null,
};

export async function fetchMenuBadges(): Promise<MenuBadges> {
  // 開発環境ではモックデータを返す
  if (process.env.NODE_ENV === 'development') {
    // 実際のAPIリクエストをシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBadges;
  }

  // 本番環境では実際のAPIを呼び出す
  const response = await fetch('https://api.example.com/menu-badges');
  if (!response.ok) {
    throw new Error('Failed to fetch menu badges');
  }
  return response.json();
} 