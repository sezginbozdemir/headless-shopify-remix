import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "@remix-run/react";

type PaginationBarProps = {
  next: boolean | undefined;
  prev: boolean | undefined;
  end: string | null;
  start: string | null;
};

export function PaginationBar({ next, prev, end, start }: PaginationBarProps) {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = Math.max(1, parseInt(pageParam || "1"));

  const getCursorPageLink = ({
    page,
    after,
    before,
  }: {
    page: number;
    after?: string | null;
    before?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams);
    if (after) {
      params.set("after", after);
      params.delete("before");
    } else if (before) {
      params.set("before", before);
      params.delete("after");
    }
    params.set("page", String(page));
    return `?${params.toString()}`;
  };
  return (
    <Pagination className="w-full">
      <PaginationContent>
        {prev && (
          <PaginationItem>
            <PaginationPrevious
              href={getCursorPageLink({ page: currentPage - 1, before: start })}
            />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink>{currentPage}</PaginationLink>
        </PaginationItem>

        {next && (
          <PaginationItem>
            <PaginationNext
              href={getCursorPageLink({ page: currentPage + 1, after: end })}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
