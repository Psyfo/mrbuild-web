# Quick Reference: Enhanced Admin Tables

## 🚀 Quick Start

### Import DataTable

```tsx
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowSelection,
  DataTableHeaderSelection,
  DataTableMultiSelect,
} from '@/components/admin/DataTable';
```

### Define Columns

```tsx
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<YourType>[] = [
  // Selection column
  {
    id: 'select',
    header: ({ table }) => <DataTableHeaderSelection table={table} />,
    cell: ({ row }) => <DataTableRowSelection row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  // Sortable text column
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  // Custom cell rendering
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={getVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  // Actions column
  {
    id: 'actions',
    cell: ({ row }) => <DropdownMenu>{/* Action items */}</DropdownMenu>,
    enableSorting: false,
  },
];
```

### Basic Usage

```tsx
<DataTable columns={columns} data={data} loading={loading} />
```

### With Search

```tsx
<DataTable
  columns={columns}
  data={data}
  searchKey='email'
  searchPlaceholder='Search by email...'
/>
```

### With Filters

```tsx
<DataTable
  columns={columns}
  data={data}
  filterComponent={
    <>
      <DataTableMultiSelect
        title='Status'
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        selected={statusFilter}
        onChange={setStatusFilter}
      />
    </>
  }
/>
```

### With Bulk Actions

```tsx
<DataTable
  columns={columns}
  data={data}
  showRowSelection
  bulkActions={[
    {
      label: 'Activate',
      action: (rows) => handleActivate(rows.map((r) => r.original.id)),
    },
    {
      label: 'Delete',
      action: (rows) => handleDelete(rows.map((r) => r.original.id)),
      variant: 'destructive',
    },
  ]}
/>
```

### With Export

```tsx
import { exportToCSV } from '@/lib/export-utils';

<DataTable
  columns={columns}
  data={data}
  onExport={(rows) => exportToCSV(rows, 'filename')}
/>;
```

### Full Example

```tsx
<DataTable
  columns={columns}
  data={filteredData}
  searchKey='name'
  searchPlaceholder='Search items...'
  loading={loading}
  showRowSelection
  showPagination
  showColumnVisibility
  defaultPageSize={20}
  pageSizeOptions={[10, 20, 50, 100]}
  filterComponent={
    <>
      <DataTableMultiSelect
        title='Status'
        options={statusOptions}
        selected={statusFilter}
        onChange={setStatusFilter}
      />
      <DataTableMultiSelect
        title='Priority'
        options={priorityOptions}
        selected={priorityFilter}
        onChange={setPriorityFilter}
      />
    </>
  }
  bulkActions={[
    {
      label: 'Mark as Read',
      action: (rows) => bulkUpdate(rows, 'read'),
    },
    {
      label: 'Delete',
      action: (rows) => bulkDelete(rows),
      variant: 'destructive',
    },
  ]}
  onExport={(rows) => exportToCSV(rows, `export-${Date.now()}`)}
/>
```

## 📋 Common Patterns

### Multi-Select Filter State

```tsx
const [statusFilter, setStatusFilter] = useState<string[]>([]);

// Apply filters
const filteredData = useMemo(() => {
  return data.filter((item) => {
    return statusFilter.length === 0 || statusFilter.includes(item.status);
  });
}, [data, statusFilter]);
```

### Badge Variants

```tsx
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'error':
      return 'destructive';
    default:
      return 'outline';
  }
};
```

### Bulk Operations

```tsx
const bulkUpdate = async (ids: string[], status: Status) => {
  try {
    const response = await fetch('/api/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, updates: { status } }),
    });

    if (!response.ok) throw new Error('Update failed');

    toast.success(`Updated ${ids.length} item(s)`);
    fetchData();
  } catch (error) {
    toast.error('Failed to update items');
  }
};
```

### Export with Transform

```tsx
const handleExport = (rows: Row<YourType>[]) => {
  const transformed = rows.map((row) => ({
    Name: row.original.name,
    Email: row.original.email,
    Status: row.original.status,
    'Created At': formatDate(row.original.createdAt),
  }));

  exportToCSV(
    { map: () => transformed } as any,
    `export-${new Date().toISOString()}`
  );
};
```

## 🎨 Styling Tips

### Custom Column Width

```tsx
{
  accessorKey: 'id',
  header: 'ID',
  size: 80, // Fixed width
}
```

### Right-Aligned Column

```tsx
{
  accessorKey: 'amount',
  header: () => <div className="text-right">Amount</div>,
  cell: ({ row }) => (
    <div className="text-right font-medium">
      {formatCurrency(row.original.amount)}
    </div>
  ),
}
```

### Truncated Text

```tsx
{
  accessorKey: 'description',
  header: 'Description',
  cell: ({ row }) => (
    <div className="max-w-md truncate">
      {row.original.description}
    </div>
  ),
}
```

## 🔧 Advanced Features

### Custom Filter Function

```tsx
{
  accessorKey: 'tags',
  header: 'Tags',
  filterFn: (row, id, value) => {
    const tags = row.getValue(id) as string[];
    return value.some((v: string) => tags.includes(v));
  },
}
```

### Disable Sorting

```tsx
{
  accessorKey: 'actions',
  header: 'Actions',
  enableSorting: false,
  enableHiding: false,
}
```

### Conditional Formatting

```tsx
cell: ({ row }) => {
  const isNew = row.original.status === 'NEW';
  return (
    <div className={isNew ? 'bg-blue-50' : ''}>{row.original.message}</div>
  );
};
```

## 💡 Pro Tips

1. **Memoize Columns**: Always wrap column definitions in `useMemo()`
2. **Filter Before Render**: Apply filters to data before passing to DataTable
3. **Use Callbacks**: Wrap API calls in `useCallback()` for better performance
4. **Loading States**: Always provide loading prop for better UX
5. **Error Handling**: Add try-catch blocks in all async operations
6. **Toast Feedback**: Show toast notifications for all user actions
7. **Confirmation Dialogs**: Use confirm() for destructive actions
8. **Responsive Design**: Test on mobile devices
9. **Accessibility**: Add ARIA labels and keyboard support
10. **TypeScript**: Define proper types for type safety

## 🐛 Troubleshooting

### Table not rendering?

- Check data is an array
- Verify columns are defined
- Ensure all required imports are present

### Filters not working?

- Check filterFn implementation
- Verify filter state management
- Ensure column has correct accessorKey

### Sorting broken?

- Enable getSortedRowModel() in table config
- Check DataTableColumnHeader is used
- Verify data types are consistent

### Export not working?

- Check Row type matches your data type
- Verify export-utils is imported correctly
- Ensure data is properly formatted

---

**Quick Links:**

- [Full Documentation](./ADMIN_TABLE_ENHANCEMENTS.md)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [shadcn/ui](https://ui.shadcn.com)
