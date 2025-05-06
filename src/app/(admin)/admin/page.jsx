'use client';



import { Box, Card, CardContent, Typography, Grid, Tabs, Tab, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { AttachMoney, ShoppingCart, Inventory, People, } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import { useState, useMemo } from 'react';

export default function AdminDashboardPage() {
  const orders = useMemo(() => ([
    { id: 1001, customer: 'Customer #1', amount: 98.13 },
    { id: 1002, customer: 'Customer #2', amount: 10.23 },
    { id: 1003, customer: 'Customer #3', amount: 47.09 },
    { id: 1004, customer: 'Customer #4', amount: 71.58 },
  ]), []);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, border: '1px solid black', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
                  Total Revenue
                </Typography>
                <AttachMoney sx={{ color: 'black', ml: 2 }} />
              </Box>
              <Typography variant="h5" component="div" sx={{mt:2}}>
                $47,856,49.00
              </Typography>
              <Typography color="textSecondary">+20.1% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, border: '1px solid black', boxShadow: 'none' }}>
            <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
                  Orders
                </Typography>
                <ShoppingCart sx={{ color: 'black', ml: 2 }} />
              </Box>
              <Typography variant="h5" component="div" sx={{mt:2}}>
                +786
              </Typography>
              <Typography color="textSecondary">+24.4% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, border: '1px solid black', boxShadow: 'none' }}>
            <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
                  Products
                </Typography>
                <Inventory sx={{ color: 'black', ml: 2 }} />
              </Box>
              <Typography variant="h5" component="div" sx={{mt:2}}>
                50
              </Typography>
              <Typography color="textSecondary">+9 new products</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, border: '1px solid black', boxShadow: 'none' }}>
            <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'black', fontWeight: 'bold' }}>
                  Customers
                </Typography>
                <People sx={{ color: 'black', ml: 2 }} />
              </Box>
              <Typography variant="h5" component="div" sx={{mt:2}}>
                +7582
              </Typography>
              <Typography color="textSecondary">+18.1% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Box sx={{ mt: 5 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Analytics" />
        </Tabs>


        {tab === 0 && (
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, border: '1px solid black', boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Recent Sales
                  </Typography>
                  <Typography color="textSecondary" mb={4}>
                    You made 885 sales this month.
                  </Typography>
                  <Box textAlign="center" color="text.disabled">
                    Sales chart placeholder
                  </Box>
                </CardContent>
              </Card>
            </Grid>


            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, border: '1px solid black', boxShadow: 'none' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Recent Orders
                  </Typography>
                  <Typography color="textSecondary" mb={4}>
                    You have 12 pending orders.
                  </Typography>

                  <List>
                    {orders.map((order) => (
                      <ListItem key={order.id} disableGutters>
                        <ListItemAvatar>
                          <Avatar>
                            <PeopleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Order #${order.id}`}
                          secondary={order.customer}
                        />
                        <Typography variant="body2">
                          ${order.amount}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <Box mt={2}>
            <Typography>Analytics content coming soon...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}