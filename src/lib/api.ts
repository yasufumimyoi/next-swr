import { MenuBadges } from '@/types/badge';

// モックデータを生成する関数
function generateMockBadges(): MenuBadges {
  const now = new Date();
  const seconds = now.getSeconds();
  
  return {
    home: {
      id: '1',
      count: 0,
      type: 'new',
      color: 'blue',
    },
    dashboard: {
      id: '2',
      count: Math.floor(seconds / 5), // 5秒ごとにカウントが増加
      type: 'notification',
      color: 'red',
    },
    settings: seconds % 2 === 0 ? { // 偶数秒の時のみバッジを表示
      id: '3',
      count: 1,
      type: 'notification',
      color: 'green',
    } : null,
  };
}

export async function fetchMenuBadges(): Promise<MenuBadges> {
  // 開発環境では動的なモックデータを返す
  if (process.env.NODE_ENV === 'development') {
    // 実際のAPIリクエストをシミュレート
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockBadges();
  }

  // 本番環境では実際のAPIを呼び出す
  const response = await fetch('https://api.example.com/menu-badges');
  if (!response.ok) {
    throw new Error('Failed to fetch menu badges');
  }
  return response.json();
} 