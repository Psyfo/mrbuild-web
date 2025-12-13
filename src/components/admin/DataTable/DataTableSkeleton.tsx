import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showPagination?: boolean;
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showPagination = true,
}: DataTableSkeletonProps) {
  return (
    <div className='space-y-4'>
      {/* Toolbar skeleton */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-2'>
          <Skeleton className='w-[300px] h-9' />
          <Skeleton className='w-[100px] h-9' />
          <Skeleton className='w-[100px] h-9' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='w-[100px] h-9' />
          <Skeleton className='w-[100px] h-9' />
        </div>
      </div>

      {/* Table skeleton */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className='w-full h-4' />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className='w-full h-4' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      {showPagination && (
        <div className='flex justify-between items-center'>
          <Skeleton className='w-[200px] h-8' />
          <div className='flex gap-2'>
            <Skeleton className='w-[60px] h-8' />
            <Skeleton className='w-[80px] h-8' />
            <Skeleton className='w-[60px] h-8' />
            <Skeleton className='w-[60px] h-8' />
          </div>
        </div>
      )}
    </div>
  );
}
