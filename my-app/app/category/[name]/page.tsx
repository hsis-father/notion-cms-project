type CategoryPageProps = {
  params: Promise<{ name: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;

  return (
    <div>
      {/* TODO: Phase 4에서 카테고리 필터링 구현 - category: {name} */}
    </div>
  );
}
