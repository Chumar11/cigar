'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Alert
} from '@mui/material'
import { QrCode2, CameraAlt, Close, Refresh } from '@mui/icons-material'

export default function UpcScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [upcCode, setUpcCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState(null)
  const [error, setError] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Start camera for scanning
  const startScanning = async () => {
    setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        requestAnimationFrame(scanFrame)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Could not access camera. Please check permissions or try manual entry.')
      setScanning(false)
    }
  }

  // Stop camera scanning
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  // Scan each video frame for a UPC code
  const scanFrame = () => {
    if (scanning && videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Simulate finding a UPC code (would use a real barcode scanner library)
        if (Math.random() < 0.01) {
          const mockUpcCode = '123456789012'
          setUpcCode(mockUpcCode)
          stopScanning()
          fetchProductData(mockUpcCode)
          return
        }

        // Draw scanning area
        context.strokeStyle = '#3b82f6'
        context.lineWidth = 3
        context.strokeRect(canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.2)

        if (!upcCode) {
          requestAnimationFrame(scanFrame)
        }
      }
    }
  }

  // Fetch product data using the UPC code
  const fetchProductData = async code => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/upc?code=${code}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch product')
      }

      const data = await response.json()
      setProductData(data)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err.message || 'Failed to fetch product data')
      setProductData(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle manual UPC submission
  const handleManualSubmit = e => {
    e.preventDefault()
    if (upcCode) {
      fetchProductData(upcCode)
    }
  }

  // Reset everything
  const handleReset = () => {
    setUpcCode('')
    setProductData(null)
    setError(null)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom fontWeight='bold' sx={{ fontSize: '2rem', mb: 3 }}>
        UPC Scanner
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={productData ? 6 : 12}>
          <Card>
            <CardContent>
              {scanning ? (
                <Box sx={{ position: 'relative' }}>
                  <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} playsInline muted />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <Button
                    onClick={stopScanning}
                    startIcon={<Close />}
                    variant='contained'
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8
                    }}
                  >
                    Stop
                  </Button>
                </Box>
              ) : (
                <>
                  {/* Scanner prompt */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 4,
                      mb: 3
                    }}
                  >
                    <QrCode2 sx={{ fontSize: 80, mb: 2, color: 'text.secondary' }} />
                    <Typography variant='body1' gutterBottom textAlign='center'>
                      Scan a UPC barcode or enter it manually below
                    </Typography>
                    <Button variant='contained' startIcon={<CameraAlt />} onClick={startScanning} sx={{ mt: 2 }}>
                      Start Scanner
                    </Button>
                  </Box>

                  {/* Manual entry form */}
                  <Box component='form' onSubmit={handleManualSubmit}>
                    <Typography variant='h6' gutterBottom>
                      Manual Entry
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        label='UPC Code'
                        value={upcCode}
                        onChange={e => setUpcCode(e.target.value)}
                        placeholder='Enter UPC code'
                      />
                      <Button type='submit' variant='contained' disabled={!upcCode || loading}>
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                      </Button>
                    </Box>
                  </Box>
                </>
              )}

              {error && (
                <Alert severity='error' sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Product data table - only shown if data exists */}
        {productData && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant='h5' fontWeight='bold'>
                    Product Details
                  </Typography>
                  <Button startIcon={<Refresh />} onClick={handleReset}>
                    Scan Another
                  </Button>
                </Box>

                <TableContainer component={Paper} variant='outlined'>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Property</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Basic Information */}
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>
                          <Typography fontWeight='bold'>{productData.name}</Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>{productData.description || 'No description'}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Brand</TableCell>
                        <TableCell>{productData.brand || 'N/A'}</TableCell>
                      </TableRow>

                      {/* Image */}
                      {productData.imageUrl && (
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>
                            <Box sx={{ maxWidth: 120, maxHeight: 120 }}>
                              <img
                                src={productData.imageUrl}
                                alt={productData.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Identification */}
                      <TableRow>
                        <TableCell>UPC</TableCell>
                        <TableCell>{productData.upc || 'N/A'}</TableCell>
                      </TableRow>

                      {productData.ean && (
                        <TableRow>
                          <TableCell>EAN</TableCell>
                          <TableCell>{productData.ean}</TableCell>
                        </TableRow>
                      )}

                      {/* Categorization */}
                      {productData.category && (
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell>{productData.category}</TableCell>
                        </TableRow>
                      )}

                      {/* Stock information */}
                      <TableRow>
                        <TableCell>Quantity</TableCell>
                        <TableCell>
                          {productData.quantity === 0 ? (
                            <Typography color='error'>Out of Stock</Typography>
                          ) : productData.quantity <= 5 ? (
                            <Typography color='warning.main'>Low Stock: {productData.quantity}</Typography>
                          ) : (
                            productData.quantity
                          )}
                        </TableCell>
                      </TableRow>

                      {productData.boxCount > 0 && (
                        <TableRow>
                          <TableCell>Box Count</TableCell>
                          <TableCell>{productData.boxCount}</TableCell>
                        </TableRow>
                      )}

                      {productData.location && (
                        <TableRow>
                          <TableCell>Location</TableCell>
                          <TableCell>{productData.location}</TableCell>
                        </TableRow>
                      )}

                      {/* Financial information */}
                      {productData.cost > 0 && (
                        <TableRow>
                          <TableCell>Cost</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(productData.cost)}
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow>
                        <TableCell>Retail Price</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(productData.retailPrice || 0)}
                        </TableCell>
                      </TableRow>

                      {/* Dates */}
                      {productData.purchaseDate && (
                        <TableRow>
                          <TableCell>Purchase Date</TableCell>
                          <TableCell>{new Date(productData.purchaseDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )}

                      {productData.manufactureDate && (
                        <TableRow>
                          <TableCell>Manufacture Date</TableCell>
                          <TableCell>{new Date(productData.manufactureDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )}

                      {productData.productionDate && (
                        <TableRow>
                          <TableCell>Production Date</TableCell>
                          <TableCell>{new Date(productData.productionDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )}

                      {/* System fields */}
                      {productData.createdAt && (
                        <TableRow>
                          <TableCell>Added On</TableCell>
                          <TableCell>{new Date(productData.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
