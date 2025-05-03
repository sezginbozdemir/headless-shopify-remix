import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "@remix-run/react";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
};

export function PaginationBar({ currentPage, totalPages }: PaginationBarProps) {
  const [searchParams] = useSearchParams();
  const getPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `?${params.toString()}`;
  };
  return (
    <Pagination className="w-full">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageLink(currentPage - 1)} />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink href={getPageLink(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>

        {currentPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => page > 1 && page < totalPages)
          .filter((page) => Math.abs(page - currentPage) <= 1)
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={getPageLink(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        {currentPage < totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href={getPageLink(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={getPageLink(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
