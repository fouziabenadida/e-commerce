export function ResultsInfo({
  total,
  page,
  pageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
}) {
  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No results</p>;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <p className="text-sm text-muted-foreground" role="status">
      Showing {from}–{to} of {total} products
    </p>
  );
}