// 'use client'
// import React, { useState } from 'react'
// import { Box, Button, Grid, Paper, Stack, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
// import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

// const AddProductForm = () => {
//   const [formData, setFormData] = useState({
//     upcCode: '',
//     productName: '',
//     quantity: 1,
//     price: 0.0,
//     description: ''
//   })

//   const handleChange = e => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantity' || name === 'price' ? Number(value) : value
//     }))
//   }

//   const handleSave = () => {
//     console.log('Saved:', formData)
//   }

//   const handleCancel = () => {
//     setFormData({
//       upcCode: '',
//       productName: '',
//       quantity: 1,
//       price: 0.0,
//       description: ''
//     })
//   }

//   return (
//     <Box>
//       <Typography variant='h5' fontWeight='bold' sx={{ fontSize: '3rem' }}>
//         Add New Product
//       </Typography>
//       <Typography color='text.secondary' mb={3}>
//         Add a new product to your inventory with UPC code and details.
//       </Typography>

//       <Paper variant='outlined' sx={{ padding: 3 }}>
//         <Typography variant='h3' fontWeight='bold' gutterBottom>
//           Product Details
//         </Typography>
//         <Typography color='text.secondary' mb={2}>
//           Enter the product information or scan a UPC code to add a new product to your inventory.
//         </Typography>

//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={20}>
//             <Box display='flex' gap={2}>
//               <TextField
//                 sx={{ flexBasis: '80%' }}
//                 label='UPC Code'
//                 placeholder='Enter UPC code'
//                 name='upcCode'
//                 value={formData.upcCode}
//                 onChange={handleChange}
//               />
//               <Button startIcon={<QrCodeScannerIcon />} variant='outlined' sx={{ flexBasis: '20%' }}>
//                 Scan UPC
//               </Button>
//             </Box>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label='Product Name'
//               placeholder='Enter product name'
//               name='productName'
//               value={formData.productName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label='Quantity'
//               name='quantity'
//               type='number'
//               value={formData.quantity}
//               onChange={handleChange}
//             />
//           </Grid>
//           {/* Row 2 */}
//           <Grid item xs={12} sm={20}>
//             <TextField
//               fullWidth
//               label='Price (Optional)'
//               name='price'
//               type='number'
//               value={formData.price}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <InputAdornment position='start'>$</InputAdornment>
//               }}
//               helperText='Enter price in USD'
//             />
//           </Grid>
//           <Grid item xs={12} sm={20}>
//             <TextField
//               fullWidth
//               multiline
//               minRows={3}
//               label='Description (Optional)'
//               placeholder='Enter product description'
//               name='description'
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={20}>
//           <Box display='flex' gap={2} mt={2}>
//             <Button variant='contained' color='primary' onClick={handleSave} sx={{ textTransform: 'none' }}>
//               Save Product
//             </Button>
//             <Button variant='outlined' onClick={handleCancel} sx={{ textTransform: 'none' }}>
//               Cancel
//             </Button>

//           </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   )
// }

// export default AddProductForm
 import AddProductForm from '@/components/admin/Addproduct'
import React from 'react'
 
 const page = () => {
   return (
        <AddProductForm/>
   )
 }
 
 export default page
