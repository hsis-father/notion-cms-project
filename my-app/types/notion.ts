// 글 발행 상태
export type PostStatus = '초안' | '발행됨';

// 블로그 포스트 타입
export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  published: string;
  status: PostStatus;
  summary: string;
};

// 카테고리 타입
export type Category = {
  name: string;
  count: number;
};

// Notion 블록 타입
export type NotionBlock = {
  id: string;
  type: string;
  // Notion 블록 타입에 따라 추가 필드
  [key: string]: unknown;
};
