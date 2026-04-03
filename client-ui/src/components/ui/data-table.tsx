import { useEffect, useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// ✅ Table skeleton rows component
const TableSkeleton = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={`skeleton-${rowIndex}`}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} className="py-4">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
  onSearch?: (query: string) => void
  isLoading?: boolean
  onSorting?: (sorting: SortingState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  onPageChange,
  onSearch,
  // onSorting,
  // onColumnFiltersChange,
  isLoading = false, // Default to false
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // ✅ Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(globalFilter)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [globalFilter, onSearch])

  return (
    <main className="w-full space-y-4">
      {/* Top Controls */}
      <nav className="flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-9 w-80" />
        ) : (
          <Input
            placeholder="Search ..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        )}

        {isLoading ? (
          <Skeleton className="h-9 w-20 ml-auto" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns().filter((col) => col.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>

      {/* Table */}
      <section className="rounded-xs border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {isLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : header.isPlaceholder ? null : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={columns.length} rows={5} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {(() => {
                        const cellValue = cell.getValue();
                        const isImage =
                          typeof cellValue === 'string' &&
                          (/\.(jpeg|jpg|png|gif|webp|svg)$/i.test(cellValue) ||
                            cellValue.toLowerCase().startsWith('https') ||
                            cellValue.startsWith('data:image'));
                        if (isImage) {
                          const imageSrc = cellValue.startsWith("http")
                            ? cellValue // Cloudinary URL
                            : `/images/${cellValue}`; // Local image

                          return (
                            <img
                              src={imageSrc || '/images/placeholder.png'}
                              alt="Image"
                              width={50}
                              height={50}
                              className="object-cover h-auto rounded-xs border"
                            />
                          );
                        }
                        return flexRender(cell.column.columnDef.cell, cell.getContext());
                      })()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 font-semibold text-center">
                  No results found !
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* Pagination Controls */}
      <section className="flex items-center justify-between text-sm">
        <div className="space-x-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 inline-block" />
              <Skeleton className="h-4 w-24 inline-block mx-2" />
              <Skeleton className="h-8 w-12 inline-block" />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className='rounded-xs'
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <Button
                variant="outline"
                className='rounded-xs'
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pageCount}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  )
}