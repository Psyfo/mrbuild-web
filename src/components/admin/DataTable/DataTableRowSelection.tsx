import { Row } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

interface DataTableRowSelectionProps<TData> {
  row: Row<TData>;
}

export function DataTableRowSelection<TData>({
  row,
}: DataTableRowSelectionProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label='Select row'
      className='translate-y-[2px]'
    />
  );
}

interface DataTableHeaderSelectionProps<TData> {
  table: {
    getIsAllPageRowsSelected: () => boolean;
    getIsSomePageRowsSelected: () => boolean;
    toggleAllPageRowsSelected: (value: boolean) => void;
  };
}

export function DataTableHeaderSelection<TData>({
  table,
}: DataTableHeaderSelectionProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label='Select all'
      className='translate-y-[2px]'
    />
  );
}
