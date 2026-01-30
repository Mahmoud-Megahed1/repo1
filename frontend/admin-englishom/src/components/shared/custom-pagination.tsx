import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import useTablePagination from '@/hooks/use-table-pagination';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { FC, useEffect } from 'react';
type CustomPaginationProps = React.ComponentProps<typeof Pagination> &
  Parameters<typeof useTablePagination>['0'] & {
    // eslint-disable-next-line no-unused-vars
    onPaginate?: (page: number) => void;
  };
const CustomPagination: FC<CustomPaginationProps> = ({
  totalPages,
  chunkSize,
  defaultPage,
  onPaginate,
  className,
  ...props
}) => {
  const {
    currentPage,
    chunkPages,
    goToNext,
    goToPage,
    goToPrev,
    hasNext,
    hasPrev,
    hasNextChunk,
    hasPrevChunk,
    lastPage,
  } = useTablePagination({
    totalPages,
    chunkSize,
    defaultPage,
  });
  const { theme } = useTheme();
  useEffect(() => {
    onPaginate?.(currentPage);
  }, [onPaginate, currentPage]);
  return (
    <Pagination className={cn('mx-0 w-fit', className)} {...props}>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={theme === 'light' ? 'secondary' : 'outline'}
            onClick={goToPrev}
            disabled={!hasPrev}
          >
            <ChevronLeftIcon className="size-4" />
            <span>Previous</span>
          </Button>
        </PaginationItem>
        {hasPrevChunk && (
          <>
            <PaginationItem>
              <Button
                size={'icon'}
                className="text-center leading-[0]"
                variant={
                  currentPage === 1
                    ? 'default'
                    : theme === 'light'
                      ? 'secondary'
                      : 'outline'
                }
                aria-checked={currentPage === 1}
                aria-label={`Go to page 1`}
                aria-current={currentPage === 1 ? 'page' : undefined}
                onClick={() => goToPage(1)}
              >
                1
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {chunkPages.map((page) => (
          <PaginationItem key={page}>
            <Button
              size={'icon'}
              className="text-center leading-[0]"
              variant={
                currentPage === page
                  ? 'default'
                  : theme === 'light'
                    ? 'secondary'
                    : 'outline'
              }
              aria-checked={currentPage === page}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}
        {hasNextChunk && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <Button
                size={'icon'}
                className="text-center leading-[0]"
                variant={
                  currentPage === lastPage
                    ? 'default'
                    : theme === 'light'
                      ? 'secondary'
                      : 'outline'
                }
                aria-checked={currentPage === lastPage}
                aria-label={`Go to page ${lastPage}`}
                aria-current={currentPage === lastPage ? 'page' : undefined}
                onClick={() => goToPage(lastPage)}
              >
                {lastPage}
              </Button>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <Button
            onClick={goToNext}
            disabled={!hasNext}
            variant={theme === 'light' ? 'secondary' : 'outline'}
          >
            <span>Next</span>
            <ChevronRightIcon className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
