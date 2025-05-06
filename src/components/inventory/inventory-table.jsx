'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  //   type ColumnDef,
  //   type ColumnFiltersState,
  //   type SortingState,
  //   type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  FormControlLabel,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { ArrowDropDown, ArrowUpward, ArrowDownward, MoreVert, Edit, Delete, QrCode2 } from '@mui/icons-material'

export default function InventoryTable({ lowStock = false, outOfStock = false, product }) {
  console.log(product)

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [editProduct, setEditProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filteredData = useMemo(() => {
    return product.filter(item => {
      if (outOfStock) return item.quantity === 0
      if (lowStock) return item.quantity > 0 && item.quantity <= 5
      return true
    })
  }, [product, lowStock, outOfStock])

  const columns = [
    {
      accessorKey: 'upc',
      header: 'UPC',
      cell: ({ row }) => (
        <Box display='flex' alignItems='center'>
          <Typography>{row.getValue('upc')}</Typography>
          <IconButton size='small'>
            <QrCode2 fontSize='inherit' />
          </IconButton>
        </Box>
      )
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => <Typography fontWeight='bold'>{row.getValue('name')}</Typography>
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => {
        const quantity = row.getValue('quantity')
        if (quantity === 0) return <Typography color='error'>Out of Stock</Typography>
        if (quantity <= 5) return <Typography color='warning.main'>Low Stock: {quantity}</Typography>
        return <Typography>{quantity}</Typography>
      }
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
      cell: ({ row }) => {
        const cost = row.getValue('cost')
        return (
          <Typography>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(cost)}
          </Typography>
        )
      }
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <Typography noWrap>{row.getValue('description')}</Typography>
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Box display='flex' gap={1}>
          <IconButton size='small' onClick={() => setEditProduct(row.original)} color='primary'>
            <Edit fontSize='inherit' />
          </IconButton>
          <IconButton size='small' onClick={() => setDeleteConfirm(row.original)} color='error'>
            <Delete fontSize='inherit' />
          </IconButton>
        </Box>
      )
    }
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <Box>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <TextField
          label='Filter products...'
          variant='outlined'
          size='small'
          onChange={e => table.getColumn('name')?.setFilterValue(e.target.value)}
        />
        <Typography variant='caption'>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected.
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display='flex' justifyContent='flex-end' mt={2} gap={1}>
        <Button variant='outlined' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant='outlined' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </Box>
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            variant='contained'
            color='error'
            // onClick={() => {
            
            //   setDeleteConfirm(null)
            // }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
