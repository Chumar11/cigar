'use client'
import { useState } from 'react'
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert
} from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Search, FilterAlt, Download } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// API functions
const fetchOrders = async () => {
  const res = await fetch('/api/order')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

const updateOrder = async order => {
  const res = await fetch(`/api/order/${order._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  if (!res.ok) throw new Error('Failed to update order')
  return res.json()
}

const deleteOrder = async id => {
  console.log('deleteid', id)
  const res = await fetch(`/api/order/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete order')
  return res.json()
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [fulfillmentStatus, setFulfillmentStatus] = useState('All Statuses')
  const [openDialog, setOpenDialog] = useState(false)
  const [editOrder, setEditOrder] = useState(null)

  const queryClient = useQueryClient()

  // Fetch orders
  const {
    data = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  })

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  // Filter orders based on search term and status
  const filteredOrders = data.filter(order => {
    const matchesSearch =
      !searchTerm ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase().trim())

    const matchesStatus = fulfillmentStatus === 'All Statuses' || order.fulfillmentStatus === fulfillmentStatus
    return matchesSearch && matchesStatus
  })

  const handleStatus = e => {
    setFulfillmentStatus(e.target.value)
  }

  const handleEdit = order => {
    setEditOrder(order)
    setOpenDialog(true)
  }

  const handleSaveEdit = () => {
    updateMutation.mutate(editOrder)
    setOpenDialog(false)
    setEditOrder(null)
  }

  const handleCancel = () => {
    setOpenDialog(false)
    setEditOrder(null)
  }

  const handleDelete = order => {
    deleteMutation.mutate(order._id)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4, lg: 6 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant='h4' fontWeight={700} sx={{ fontSize: '3rem' }}>
            Orders
          </Typography>
          <Typography variant='h5' fontWeight={500} sx={{ mt: 3 }}>
            Order Management
          </Typography>
          <Typography>View and manage all customer orders.</Typography>
        </Box>
        <Button variant='contained' sx={{ mb: 10 }} startIcon={<Download />}>
          Export
        </Button>
      </Box>

      {updateMutation.isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to update order: {updateMutation.error.message}
        </Alert>
      )}

      {deleteMutation.isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to delete order: {deleteMutation.error.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder='Search orders...'
          size='small'
          sx={{ width: 250 }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            )
          }}
        />
        <TextField
          select
          size='small'
          value={fulfillmentStatus}
          onChange={handleStatus}
          sx={{ width: 150 }}
          SelectProps={{
            IconComponent: KeyboardArrowDown
          }}
        >
          <MenuItem value='All Statuses'>All Statuses</MenuItem>
          <MenuItem value='Delivered'>Delivered</MenuItem>
          <MenuItem value='Shipped'>Shipped</MenuItem>
          <MenuItem value='Processing'>Processing</MenuItem>
          <MenuItem value='Pending'>Pending</MenuItem>
          <MenuItem value='Cancelled'>Cancelled</MenuItem>
        </TextField>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid black' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Products</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading orders...</Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Alert severity='error'>Error loading orders: {error.message}</Alert>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(order => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.productList?.map(p => p.name || 'Unknown').join(', ') || 'No products'}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.fulfillmentStatus}</TableCell>
                  <TableCell align='left'>
                    ${order.productList?.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => handleEdit(order)}
                      disabled={updateMutation.isLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      size='small'
                      sx={{ ml: 2 }}
                      variant='outlined'
                      color='error'
                      onClick={() => handleDelete(order)}
                      disabled={deleteMutation.isLoading}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCancel} maxWidth='sm' fullWidth>
        <DialogTitle>Edit Order: {editOrder?.orderId}</DialogTitle>
        <DialogContent>
          <TextField
            label='Customer Name'
            value={editOrder?.customerName || ''}
            onChange={e => setEditOrder({ ...editOrder, customerName: e.target.value })}
            fullWidth
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label='Status'
            select
            value={editOrder?.fulfillmentStatus || ''}
            onChange={e => setEditOrder({ ...editOrder, fulfillmentStatus: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value='Delivered'>Delivered</MenuItem>
            <MenuItem value='Shipped'>Shipped</MenuItem>
            <MenuItem value='Processing'>Processing</MenuItem>
            <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='Cancelled'>Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant='contained' color='primary' disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
