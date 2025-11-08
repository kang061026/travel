export const TAB_LABELS = [
  // 일차 일정(1~5일차)
  { key: 'day1', label: '1일차 일정' },
  { key: 'day3', label: '3일차 일정' }, // 추가
  { key: 'day4', label: '4일차 일정' },
  { key: 'day5', label: '5일차 일정' }, // 추가

  // 개인 일정
  { key: 'personal_arum', label: '이아름 개인일정' },
  { key: 'personal_seunghyun', label: '이승현 개인일정' },
  { key: 'personal_choi', label: '최강 개인일정' },
  { key: 'personal_eunseo', label: '이은서 개인일정' }, // 추가

  // 위시리스트
  { key: 'food', label: '먹고싶은 것' },
  { key: 'place', label: '가고싶은 곳' }
] as const

export type TabKey = typeof TAB_LABELS[number]['key']

export const formatKRW = (n: number) =>
  n.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + '원'
