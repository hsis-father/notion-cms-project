type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return (
    <div>
      {/* TODO: Phase 3에서 글 상세 구현 - slug: {slug} */}
    </div>
  );
}
