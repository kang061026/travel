export const TAB_LABELS = [
  { key: 'day1', label: '1일차 일정' },
  { key: 'day2', label: '2일차 일정' },
  { key: 'day4', label: '4일차 일정' },
  { key: 'personal_arum', label: '이아름 개인일정' },
  { key: 'personal_seunghyun', label: '이승현 개인일정' },
  { key: 'personal_choi', label: '최강 개인일정' },
  { key: 'food', label: '먹고싶은 것' },
  { key: 'place', label: '가고싶은 곳' }
] as const

export type TabKey = typeof TAB_LABELS[number]['key']

export const formatKRW = (n: number) =>
  n.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + '원'
