import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 조건부로 결합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷
 * @param dateString - ISO 형식 날짜 문자열
 * @returns 포맷된 한국어 날짜 문자열 (예: 2026년 5월 31일)
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 제목 문자열을 URL 슬러그로 변환
 * @param title - 원본 제목 문자열
 * @returns URL에 사용 가능한 슬러그 문자열
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
