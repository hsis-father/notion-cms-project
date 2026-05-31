import { Client } from '@notionhq/client';
import { Post, NotionBlock } from '@/types/notion';

// Notion API 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

/**
 * 발행된 글 목록 조회 (최신순 정렬)
 * @returns 발행 상태인 포스트 목록
 */
export async function fetchPages(): Promise<Post[]> {
  // TODO: Phase 2에서 구현
  // - Status = '발행됨' 필터 적용
  // - Published 날짜 기준 내림차순 정렬
  return [];
}

/**
 * 슬러그로 특정 글 조회
 * @param slug - 글 고유 슬러그
 * @returns 해당 포스트 또는 null
 */
export async function fetchPageBySlug(slug: string): Promise<Post | null> {
  // TODO: Phase 2에서 구현
  return null;
}

/**
 * 글의 블록 콘텐츠 조회
 * @param pageId - Notion 페이지 ID
 * @returns 페이지의 블록 목록
 */
export async function fetchPageContent(pageId: string): Promise<NotionBlock[]> {
  // TODO: Phase 2에서 구현
  return [];
}
