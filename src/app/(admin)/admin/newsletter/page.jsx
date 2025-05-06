'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  MenuItem,
  Select,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'

const fetchNewsletters = async () => {
  const res = await fetch('/api/newsletter')
  if (!res.ok) throw new Error('Network response was not ok')
  const data = await res.json()
  return data // This returns the full response with signups and pagination
}

export default function NewsletterPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All Sources')

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['newsletters'],
    queryFn: fetchNewsletters
  })

  // Early return for loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Early return for error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    )
  }

  // Get the signups array from the nested response
  const subscribers = data?.signups || []
  
  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    })
  }

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = sourceFilter === 'All Sources' || subscriber.source === sourceFilter
    return matchesSearch && matchesSource
  })

  // Get unique sources for filter dropdown
  const sources = ['All Sources', ...new Set(subscribers.map(sub => sub.source))]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' fontWeight={700} gutterBottom sx={{ fontSize: '3rem' }}>
        Newsletter Signups
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        
        <Select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 150 }}
        >
          {sources.map(source => (
            <MenuItem key={source} value={source}>
              {source}
            </MenuItem>
          ))}
        </Select>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        Total subscribers: {data?.pagination?.total || 0}
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Email</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Date</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Source</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Status</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscribers.map(subscriber => (
              <TableRow key={subscriber._id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                <TableCell>{subscriber.source}</TableCell>
                <TableCell>{subscriber.status}</TableCell>
              </TableRow>
            ))}
            {filteredSubscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No subscribers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
