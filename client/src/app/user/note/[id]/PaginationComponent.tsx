"use client";

import { Button } from "@/src/components/shared/components/ui/button";
import { IPaginationComponentProps } from "@/src/types/userProps";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";

export const PaginationComponent = ({ currentPage, totalPages, onPageChange }: IPaginationComponentProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <WithTooltip content="Go to previous page">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
      </WithTooltip>

      {pageNumbers.map((number) => (
        <WithTooltip key={number} content={`Go to page ${number}`}>
          <Button
            variant={currentPage === number ? "default" : "outline"}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        </WithTooltip>
      ))}

      <WithTooltip content="Go to next page">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </WithTooltip>
    </div>
  );
};
