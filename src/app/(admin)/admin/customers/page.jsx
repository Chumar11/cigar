'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  Button,
  IconButton,
  Paper,
  Card,
  CardHeader
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'



const fetchCustomers = async () => {
  const res = await fetch('/api/customers')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

const CustomersPage = () => {
  const [tab, setTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchCustomers
  })
  console.log('data', data)

  const filteredcustomers = data?.filter(cust => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = tab === 0 || (tab === 1 && cust.isAdmin) || (tab === 2 && !cust.isAdmin)

    return matchesSearch && matchesTab
  })

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant='h4' fontWeight={700} sx={{ fontSize: '3rem' }} gutterBottom>
            Customers
          </Typography>
          <Typography color='text.secondary'>Manage your Customers.</Typography>
        </Box>
        <Button variant='contained' sx={{ mt: 3, mb: 2 }}>
          Export Customers
        </Button>
      </Box>
      <Paper sx={{ boxShadow: 4, borderRadius: 1, p: 4 }}>
        <Typography variant='h5' fontWeight={500}>
          Customer Management
        </Typography>
        <Typography variant='body2'>Manage your customers and their information</Typography>

        <TextField
          placeholder='Search customers...'
          fullWidth
          size='small'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ mt: 4, mb: 2, maxWidth: 400 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ minWidth: '100%' }}>
            <Tab label='All' />
            <Tab label='Admins' />
            <Tab label='Customers' />
          </Tabs>
        </Box>

        <Table>
          <TableHead>
            <TableRow fontWeight={400}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredcustomers.map((cust, idx) => (
              <TableRow key={idx}>
                <TableCell variant='caption' color='text.secondary' sx={{ fontWeight: '700', fontSize: '15px' }}>
                  {cust.name}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{cust.email}</TableCell>
                <TableCell sx={{ fontSize: '15px' }}>
                  {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell sx={{ fontSize: '15px' }}>{cust.orders.length}</TableCell>
                <TableCell>
                  <Switch checked={cust.isAdmin} />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default CustomersPage
