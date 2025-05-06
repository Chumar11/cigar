'use client'
import React, { useState } from 'react'
import { Box, Button, Grid, Paper, TextField, Typography, InputAdornment } from '@mui/material'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const AddProductForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    brand: '',
    specs: '',
    category: '',
    categoryPath: '',
    ingredients: '',
    upc: '',
    ean: '',
    quantity: 0,
    purchaseDate: '',
    manufactureDate: '',
    productionDate: '',
    boxCount: 0,
    cost: 0,
    retailPrice: 0,
    location: ''
  })

  const createMutation = useMutation({
    mutationFn: async data => {
      const res = await fetch('/api/inventable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create product')
      return res.json()
    },
    onSuccess: () => {
      toast.success('Product added successfully')
      queryClient.invalidateQueries(['addProducts'])
      router.push('/admin/inventory')
    },
    onError: error => {
      toast.error('Failed to create service')
      console.error('Error creating service:', error)
    }
  })

  const handleChange = e => {
    const { name, value } = e.target
    const numberFields = ['quantity', 'boxCount', 'cost', 'retailPrice']
    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value
    }))
  }

  const handleSave = async () => {
    // Preprocess comma-separated fields into arrays
    const processedData = {
      ...formData,
      specs: formData.specs ? formData.specs.split(',').map(s => s.trim()) : [],
      categoryPath: formData.categoryPath ? formData.categoryPath.split(',').map(c => c.trim()) : [],
      ingredients: formData.ingredients ? JSON.parse(formData.ingredients || '{}') : {}
    }

    try {
      await createMutation.mutateAsync({
        ...formData
        // servicesdesc: editorContent,
      })
    } catch (error) {
      console.error('Error creating service:', error)
    }

    console.log('Saved:', processedData)
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      brand: '',
      specs: '',
      category: '',
      categoryPath: '',
      ingredients: '',
      upc: '',
      ean: '',
      quantity: 0,
      purchaseDate: '',
      manufactureDate: '',
      productionDate: '',
      boxCount: 0,
      cost: 0,
      retailPrice: 0,
      location: ''
    })
  }

  return (
    <Box>
      <Typography variant='h5' fontWeight='bold' sx={{ fontSize: '3rem' }}>
        Add New Product
      </Typography>
      <Typography color='text.secondary' mb={3}>
        Add a new product to your inventory with all relevant details.
      </Typography>

      <Paper variant='outlined' sx={{ padding: 3 }}>
        <Typography variant='h3' fontWeight='bold' gutterBottom>
          Product Details
        </Typography>
        <Typography color='text.secondary' mb={2}>
          Enter the product information or scan a UPC code to add a new product to your inventory.
        </Typography>

        <Grid container spacing={3}>
          {/* UPC Code + Scanner */}
          <Grid item xs={12}>
            <Box display='flex' gap={2}>
              <TextField
                sx={{ flexBasis: '80%' }}
                label='UPC Code'
                placeholder='Enter UPC code'
                name='upc'
                value={formData.upc}
                onChange={handleChange}
                fullWidth
              />
              <Button startIcon={<QrCodeScannerIcon />} variant='outlined' sx={{ flexBasis: '20%' }}>
                Scan UPC
              </Button>
            </Box>
          </Grid>

          {/* Name (Required) */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label='Product Name'
              placeholder='Enter product name'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Brand */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Brand'
              placeholder='Enter brand name'
              name='brand'
              value={formData.brand}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' gap={2}>
              <TextField
                fullWidth
                label='Image URL'
                placeholder='Image URL will appear here after selecting a photo'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={handleChange}
                helperText='Select a photo to auto-fill the URL or paste one manually'
              />
              <Button component='label' variant='outlined' sx={{ whiteSpace: 'nowrap', height: '65px' }}>
                Upload Photo
                <input
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const imageUrl = URL.createObjectURL(file)
                      setFormData(prev => ({ ...prev, imageUrl }))
                    }
                  }}
                />
              </Button>
            </Box>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Category'
              placeholder='Enter category'
              name='category'
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>

          {/* Category Path (Comma separated) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Category Path (Comma separated)'
              placeholder='e.g. Electronics, Gadgets'
              name='categoryPath'
              value={formData.categoryPath}
              onChange={handleChange}
              helperText='Separate with commas'
            />
          </Grid>

          {/* Specs (Comma separated) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Specifications (Comma separated)'
              placeholder='e.g. Bluetooth, Waterproof'
              name='specs'
              value={formData.specs}
              onChange={handleChange}
              helperText='Separate with commas'
            />
          </Grid>

          {/* Ingredients (JSON string) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label='Ingredients (Optional, JSON)'
              placeholder='{"ingredient1": "value", "ingredient2": "value"}'
              name='ingredients'
              value={formData.ingredients}
              onChange={handleChange}
              helperText='Enter JSON object for ingredients (optional)'
            />
          </Grid>

          {/* Quantity */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Quantity'
              name='quantity'
              type='number'
              value={formData.quantity}
              onChange={handleChange}
            />
          </Grid>

          {/* Box Count */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Box Count'
              name='boxCount'
              type='number'
              value={formData.boxCount}
              onChange={handleChange}
            />
          </Grid>

          {/* Cost */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Cost'
              name='cost'
              type='number'
              value={formData.cost}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              }}
            />
          </Grid>

          {/* Retail Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Retail Price'
              name='retailPrice'
              type='number'
              value={formData.retailPrice}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              }}
            />
          </Grid>

          {/* EAN */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='EAN'
              placeholder='Enter EAN code'
              name='ean'
              value={formData.ean}
              onChange={handleChange}
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Location'
              placeholder='Enter storage location'
              name='location'
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>

          {/* Purchase Date */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Purchase Date'
              name='purchaseDate'
              type='date'
              value={formData.purchaseDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Manufacture Date */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Manufacture Date'
              name='manufactureDate'
              type='date'
              value={formData.manufactureDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Production Date */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Production Date'
              name='productionDate'
              type='date'
              value={formData.productionDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label='Description (Optional)'
              placeholder='Enter product description'
              name='description'
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box display='flex' gap={2} mt={2}>
              <Button variant='contained' color='primary' onClick={handleSave} sx={{ textTransform: 'none' }}>
                Save Product
              </Button>
              <Button variant='outlined' onClick={handleCancel} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default AddProductForm
