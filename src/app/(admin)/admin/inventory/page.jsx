'use client'

import { useEffect, useState } from 'react'
import {
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Grid,
  Stack
} from '@mui/material'
import { QrCode, Download, Upload, Filter, Add } from '@mui/icons-material'
import Link from 'next/link'
import InventoryTable from '@/components/inventory/inventory-table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const fetchInventory = async () => {
  const res = await fetch('/api/inventable')
  if (!res.ok) throw new Error('Network response was not ok')
  return res.json()
}

export default function InventoryPage() {
  const [tab, setTab] = useState('all')
  const [product, setProduct] = useState([])
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['fetchInventory'],
    queryFn: fetchInventory
  })

  // useEffect(() => {
  //   if (data) {
  //     setProduct(data)
  //   }
  // }, [data])

  // console.log(product)

  const handleTabChange = (_, newValue) => {
    setTab(newValue)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={2} alignItems='center' justifyContent='space-between' sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant='h4' fontWeight={700} sx={{ fontSize: '3rem' }}>
            Inventory
          </Typography>
          <Typography color='text.secondary'>Manage your product inventory and track stock levels.</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction='row' spacing={2} justifyContent='flex-end' flexWrap='wrap'>
            <Link href='/scan' passHref>
              <Button variant='outlined' size='small' startIcon={<QrCode />}>
                Scan UPC
              </Button>
            </Link>
            <Button variant='outlined' size='small' startIcon={<Filter />}>
              Filter
            </Button>
            <Button variant='outlined' size='small' startIcon={<Download />}>
              Export
            </Button>
            <Button variant='outlined' size='small' startIcon={<Upload />}>
              Import
            </Button>
            <Link href='/admin/add' passHref>
              <Button variant='contained' size='small' startIcon={<Add />} sx={{ mt: 2 }}>
                Add Product
              </Button>
            </Link>
          </Stack>
        </Grid>
      </Grid>

      <Tabs value={tab} onChange={handleTabChange} textColor='primary' indicatorColor='primary'>
        <Tab value='all' label='All Products' />
        <Tab value='low-stock' label='Low Stock' />
        <Tab value='out-of-stock' label='Out of Stock' />
      </Tabs>

      <Box mt={4}>
        {tab === 'all' && (
          <Card>
            <CardHeader
              title='Product Inventory'
              subheader='Manage your product inventory, scan UPC codes, and update product details.'
            />
            <CardContent>
              <InventoryTable product={data} />
            </CardContent>
          </Card>
        )}

        {tab === 'low-stock' && (
          <Card>
            <CardHeader
              title='Low Stock Products'
              subheader='Products with inventory levels below the minimum threshold.'
            />
            <CardContent>
              <InventoryTable lowStock product={data} />
            </CardContent>
          </Card>
        )}

        {tab === 'out-of-stock' && (
          <Card>
            <CardHeader title='Out of Stock Products' subheader='Products that are currently out of stock.' />
            <CardContent>
              <InventoryTable outOfStock product={data} />
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}
