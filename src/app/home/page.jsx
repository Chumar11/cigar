'use client'
import { Box, Typography, TextField, Button, Container, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';


export default function Home() {


    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url('/images/home/cigar.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                color: '#6d4f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#e0c29f',
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="h5"
                    sx={{
                        letterSpacing: 4,
                        mb: 1,
                        fontFamily: 'serif',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}>
                    THE CIGAR SOCIETY
                </Typography>
                <Typography variant="h1" sx={{
                    fontWeight: 300,
                    fontFamily: 'serif',
                    fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3rem' },
                    letterSpacing: 0.1,
                    textTransform: 'uppercase',
                    mb: 2,
                    lineHeight: 1.4,
                }}>
                    ELEVATING TRADITION

                </Typography>
                <Typography variant="h1" sx={{
                    fontWeight: 300,
                    fontFamily: 'serif',
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                }}>
                    REDEFINING LUXURY

                </Typography>
                <Typography variant="h6" sx={{
                    mb: 3,
                    mt: 1,
                    fontFamily: 'serif',
                    letterSpacing: '0.1em',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    maxWidth: '100%',
                }}>
                    Join our exclusive circle. Sign up for updates on events,and more.
                </Typography>
                <Stack direction="row" spacing={0} sx={{ border: '1px solid #e0c29f', width: '100%', borderRadius: '12px' }}>
                    <TextField
                        placeholder="Email address"
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        sx={{
                            flex: 1,
                            px: 2,
                            input: { color: '#e0c29f' },
                            backgroundColor: 'transparent',
                            '& .MuiInputBase-root': {
                                borderRadius: '12px 0 0 12px'
                            },
                            '& input::placeholder': {
                                color: '#e0c29f', // Dark placeholder text color
                            },
                        }}
                    />
                    <Button
                        variant="outlined"
                        sx={{
                            borderLeft: '1px solid #e0c29f',
                            borderRadius: '0 12px 12px 0',
                            color: '#e0c29f',
                            px: 4,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#e0c29f',
                                color: '#000',
                            },
                        }}
                    >
                        SUBSCRIBE
                    </Button>
                </Stack>
                <Box mt={3}>
                    <Link href="/admin" passHref>

                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon sx={{
                                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                            }} />}
                            sx={{
                                backgroundColor: '#e0c29f',
                                color: '#000',
                                fontWeight: 'bold',
                                px: 5,
                                py: 1.5,
                                borderRadius: '8px',
                                textTransform: 'uppercase',
                                transition: 'transform 0.1s ease, background-color 0.1s ease',
                                '&:hover': {
                                    backgroundColor: '#d5af88',

                                },
                                '&:hover .MuiButton-endIcon': {
                                    transform: 'translateX(10px)',
                                },
                            }}
                        >
                            GET STARTED
                        </Button>
                    </Link>

                </Box>
            </Container>
        </Box>
    );
}
