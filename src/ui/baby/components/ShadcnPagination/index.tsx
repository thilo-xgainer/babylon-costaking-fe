import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/baby/components/Pagination";
import { PaginationType } from "@/types/type";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
}

const maxPagesToShow = 3;

export const ShadcnPagination: React.FC<Props> = ({
  pagination,
  setPagination,
}) => {
  const [displayPage, setDisplayPage] = useState<string[]>([]);

  const handleChangePage = (isNext: boolean) => {
    if (
      (isNext && pagination.currentPage === pagination.totalPage) ||
      (!isNext && pagination.currentPage === 1)
    ) {
      return;
    }
    const currentPage = isNext
      ? pagination.currentPage + 1
      : pagination.currentPage - 1;
    setPagination((prev) => ({
      ...prev,
      currentPage: currentPage,
    }));
  };

  const getPageNumber = () => {
    const pageNumbers: string[] = [];
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxPagesToShow / 2),
    );
    let endPage = Math.min(
      pagination.totalPage,
      startPage + maxPagesToShow - 1,
    );

    // Ensure we have exactly maxPagesToShow pages unless we hit the bounds
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add ellipsis at the beginning if needed
    if (startPage > 1) {
      pageNumbers.push("1");
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Add page numbers within the range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i.toString());
    }

    // Add ellipsis at the end if needed
    if (endPage < pagination.totalPage) {
      if (endPage < pagination.totalPage - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(pagination.totalPage.toString());
    }

    setDisplayPage([...pageNumbers]);
  };

  useEffect(() => {
    getPageNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.totalPage]);

  return (
    <Pagination className={`mt-5 justify-end`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={pagination.currentPage === 1}
            className={`dark:text-white ${
              pagination.currentPage === 1
                ? "bg-[#F6FAFE] text-black hover:bg-[#F6FAFE]"
                : "cursor-pointer"
            }`}
            onClick={() => {
              handleChangePage(false);
            }}
          />
        </PaginationItem>
        {displayPage.map((pageNumber, index) => {
          return (
            <PaginationItem
              key={index}
              className="cursor-pointer text-black dark:text-white"
            >
              <PaginationLink
                onClick={() => {
                  if (
                    pageNumber === "..." ||
                    pageNumber === pagination.currentPage.toString()
                  )
                    return;
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Number(pageNumber),
                  }));
                }}
                className={`hover:no-underline dark:text-white ${
                  pageNumber === "..."
                    ? "cursor-default dark:text-white"
                    : "cursor-pointer dark:text-white"
                }`}
                isActive={pageNumber === pagination.currentPage.toString()}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            aria-disabled={pagination.currentPage === pagination.totalPage}
            className={`${
              pagination.currentPage === pagination.totalPage
                ? "bg-[#F6FAFE] text-black hover:bg-[#F6FAFE] dark:text-white"
                : "cursor-pointer dark:text-white"
            }`}
            onClick={() => {
              handleChangePage(true);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
