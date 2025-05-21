export interface Badge {
  id: string;
  count: number;
  type: 'new' | 'notification';
  color: 'blue' | 'red' | 'green';
}

export interface MenuBadges {
  home: Badge | null;
  dashboard: Badge | null;
  settings: Badge | null;
} 