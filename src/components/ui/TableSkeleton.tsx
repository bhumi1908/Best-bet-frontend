"use client";

import * as React from "react";
import { Skeleton } from "./Skeleton";
import { TableRow, TableCell } from "./Table";

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

function TableSkeleton({ rows = 10, columns }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export { TableSkeleton };

