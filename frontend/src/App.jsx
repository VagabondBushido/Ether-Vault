import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useWaitForTransaction, useBalance, useNetwork } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { contractABI, contractAddress, tokenName } from './config/contract';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9d',
      light: '#6effd1',
      dark: '#00cb6e',
    },
    secondary: {
      main: '#ff00ff',
      light: '#ff6eff',
      dark: '#cb00cb',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: { xs: '2.5rem', md: '3.5rem' },
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: { xs: '1.5rem', md: '2rem' },
    },
    h5: {
      fontSize: { xs: '1.1rem', md: '1.3rem' },
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          padding: '12px 24px',
          fontSize: '1.1rem',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::after': {
            opacity: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
      },
    },
  },
});

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading: isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const { chain } = useNetwork();

  // Get wallet balance
  const { data: walletBalance } = useBalance({
    address,
    watch: true,
  });

  // Contract reads with error handling
  const { data: stakedBalance, isLoading: isLoadingStakedBalance } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'Balances',
    args: [address],
    watch: true,
    enabled: !!address && !!contractAddress,
    onError: (error) => {
      console.error('Error fetching staked balance:', error);
      setSnackbar({
        open: true,
        message: 'Unable to fetch staked balance. Please check your connection.',
        severity: 'error',
      });
    },
  });

  const { data: rewards, isLoading: isLoadingRewards } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getRewards',
    args: [address],
    watch: true,
    enabled: !!address && !!contractAddress,
    onError: (error) => {
      console.error('Error fetching rewards:', error);
      setSnackbar({
        open: true,
        message: 'Unable to fetch rewards. Please check your connection.',
        severity: 'error',
      });
    },
  });

  // Contract writes with error handling
  const { write: stake, data: stakeData, isLoading: isStaking } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'stake',
    onError: (error) => {
      console.error('Staking error:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to stake tokens. Please try again.',
        severity: 'error',
      });
    },
  });

  const { write: withdraw, data: withdrawData, isLoading: isWithdrawing } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'unstake',
    onError: (error) => {
      console.error('Withdrawal error:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to withdraw tokens. Please try again.',
        severity: 'error',
      });
    },
  });

  const { write: claimRewards, data: claimData, isLoading: isClaiming } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'claimRewards',
    onError: (error) => {
      console.error('Claim rewards error:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'Failed to claim rewards. Please try again.',
        severity: 'error',
      });
    },
  });

  // Transaction watchers
  useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Successfully staked tokens!',
        severity: 'success',
      });
      setStakeAmount('');
    },
  });

  useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Successfully withdrew tokens!',
        severity: 'success',
      });
      setWithdrawAmount('');
    },
  });

  useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Successfully claimed rewards!',
        severity: 'success',
      });
    },
  });

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid amount to stake',
        severity: 'warning',
      });
      return;
    }
    try {
      stake({
        value: parseEther(stakeAmount),
      });
    } catch (error) {
      console.error('Stake error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to stake tokens. Please check your balance and try again.',
        severity: 'error',
      });
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid amount to withdraw',
        severity: 'warning',
      });
      return;
    }
    try {
      withdraw({
        args: [parseEther(withdrawAmount)],
      });
    } catch (error) {
      console.error('Withdraw error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to withdraw tokens',
        severity: 'error',
      });
    }
  };

  const handleWalletClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (chain && contractAddress) {
      console.log('Connected to chain:', chain.name);
      console.log('Contract address:', contractAddress);
    }
  }, [chain, contractAddress]);

  // Update network check
  if (!isConnected) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            py: { xs: 4, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Stack direction="row" spacing={2}>
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    variant="contained"
                    onClick={() => connect({ connector })}
                    disabled={!connector.ready || isConnecting}
                    sx={{
                      borderRadius: '20px',
                      px: 3,
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    {isConnecting && connector.id === pendingConnector?.id ? (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ) : (
                      <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                    )}
                    Connect {connector.name}
                  </Button>
                ))}
              </Stack>
            </Box>
            <Typography
              variant="h1"
              align="center"
              sx={{
                background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              EtherVault
            </Typography>
            <Typography 
              variant="h5" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: { xs: 4, md: 6 }, maxWidth: '800px', mx: 'auto' }}
            >
              Connect your wallet to start staking ETH and earn VGB rewards
            </Typography>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (chain && chain.id !== 11155111) { // Sepolia chain ID
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            py: { xs: 4, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Alert 
              severity="error" 
              sx={{ 
                mt: 4,
                backdropFilter: 'blur(10px)',
                background: 'rgba(211, 47, 47, 0.1)',
                border: '1px solid rgba(211, 47, 47, 0.3)',
                borderRadius: 2,
              }}
              action={
                <Button 
                  color="error" 
                  size="small" 
                  variant="outlined"
                  onClick={() => {
                    // Request network switch to Sepolia
                    if (window.ethereum) {
                      window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
                      }).catch((error) => {
                        console.error('Error switching network:', error);
                      });
                    }
                  }}
                >
                  Switch to Sepolia
                </Button>
              }
            >
              Please connect to the Sepolia network to use this application.
            </Alert>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          py: { xs: 4, md: 8 },
        }}
      >
        {/* Wallet Connection Header */}
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        {isConnected ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleWalletClick}
                  startIcon={<AccountBalanceWalletIcon />}
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      background: 'rgba(26, 26, 26, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <MenuItem>
                    <Typography variant="body2" color="text.secondary">
                      Balance: {walletBalance?.formatted || '0'} {walletBalance?.symbol}
                    </Typography>
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={() => { disconnect(); handleClose(); }}>
                    <LogoutIcon sx={{ mr: 1 }} /> Disconnect
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={2}>
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    variant="contained"
                    onClick={() => connect({ connector })}
                    disabled={!connector.ready || isConnecting}
                    sx={{
                      borderRadius: '20px',
                      px: 3,
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    {isConnecting && connector.id === pendingConnector?.id ? (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ) : (
                      <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                    )}
                    Connect {connector.name}
                  </Button>
                ))}
              </Stack>
            )}
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              align="center"
              sx={{
                background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              EtherVault
            </Typography>
            <Typography 
              variant="h5" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: { xs: 4, md: 6 }, maxWidth: '800px', mx: 'auto' }}
            >
              Stake your ETH to earn VGB rewards in a secure, decentralized platform
            </Typography>
          </motion.div>

          {/* Stats Section - New */}
      {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Grid container spacing={2} sx={{ mb: 6 }}>
                <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(98,126,234,0.08), rgba(98,126,234,0.2))',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: -100,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(98,126,234,0.1), transparent)',
                          animation: 'shimmer 2s infinite',
                        },
                        '@keyframes shimmer': {
                          '0%': { left: '-100%' },
                          '100%': { left: '100%' }
                        }
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                        <motion.div 
                          animate={{ rotateY: [0, 360] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        >
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png" 
                            alt="ETH"
                            style={{ width: '40px', height: '40px' }}
                          />
                        </motion.div>
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        Wallet Balance (ETH)
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#627EEA' }}>
                        {walletBalance?.formatted || '0'} ETH
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(98,126,234,0.08), rgba(98,126,234,0.2))',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: -100,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(98,126,234,0.1), transparent)',
                          animation: 'shimmer 2s infinite',
                        }
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                        <motion.div 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [0.8, 1.2, 0.8], rotateZ: [0, 10, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(98,126,234,0.2)',
                            boxShadow: '0 0 15px rgba(98,126,234,0.5)'
                          }}>
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png" 
                              alt="ETH"
                              style={{ width: '30px', height: '30px' }}
                            />
                          </Box>
                        </motion.div>
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        Total Staked (ETH)
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#627EEA' }}>
                        {isLoadingStakedBalance ? (
                          <CircularProgress size={24} />
                        ) : (
                          `${formatEther(stakedBalance || 0n)} ETH`
                        )}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(0,255,157,0.1), rgba(255,0,255,0.1))',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'radial-gradient(circle, transparent 30%, rgba(0,255,157,0.03) 70%)',
                          backgroundSize: '400% 400%',
                          animation: 'pulse 15s ease infinite',
                        },
                        '@keyframes pulse': {
                          '0%': { backgroundPosition: '0% 0%' },
                          '50%': { backgroundPosition: '100% 100%' },
                          '100%': { backgroundPosition: '0% 0%' }
                        },
                        zIndex: 0,
                      }}
                    >
                      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <motion.div 
                          animate={{ 
                            boxShadow: [
                              '0 0 5px rgba(0,255,157,0.5)', 
                              '0 0 20px rgba(255,0,255,0.5)', 
                              '0 0 5px rgba(0,255,157,0.5)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          style={{
                            borderRadius: '50%',
                            padding: '8px'
                          }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          >
                            <Box
                              component="div"
                              sx={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                                display: 'flex',
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'white'
                              }}
                            >
                              VGB
                            </Box>
                          </motion.div>
                        </motion.div>
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
                        Available Rewards (VGB)
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        background: 'linear-gradient(45deg, #00ff9d, #ff00ff)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {isLoadingRewards ? (
                          <CircularProgress size={24} />
                        ) : (
                          `${formatEther(rewards || 0n)} VGB`
                        )}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          )}

          <Grid container spacing={4} ref={ref}>
            {/* Staking Section */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(26, 26, 26, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(98,126,234,0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #627EEA, transparent)',
                    }
                  }}
                >
                  <Typography variant="h4" gutterBottom sx={{ 
                    color: '#627EEA',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    Stake ETH
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        rotateZ: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut"
                      }}
                    >
                      <Box sx={{
                        position: 'relative',
                        width: '34px',
                        height: '34px'
                      }}>
                        <motion.div
                          initial={{ opacity: 0.3, scale: 0.8 }}
                          animate={{ 
                            opacity: [0.3, 0.7, 0.3],
                            scale: [0.8, 1.1, 0.8],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'rgba(98,126,234,0.3)',
                          }}
                        />
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png" 
                          alt="ETH"
                          style={{ 
                            width: '34px', 
                            height: '34px',
                            position: 'relative',
                            zIndex: 1 
                          }}
                        />
                      </Box>
                    </motion.div>
                  </Typography>
                  <Stack spacing={3} sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Amount to Stake"
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                      disabled={!isConnected || isStaking}
                      InputProps={{
                        inputProps: { min: 0, step: "0.000000000000000001" }
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleStake}
                      disabled={!isConnected || !stakeAmount || isStaking}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(45deg, #627EEA, #8294ea)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5470ea, #7084ea)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                          transform: 'rotate(30deg)',
                          transition: 'all 0.6s ease',
                        },
                        '&:hover::before': {
                          transform: 'rotate(0deg)',
                        }
                      }}
                    >
                      {isStaking ? <CircularProgress size={24} /> : 'Stake'}
                    </Button>
                    {isConnected && (
                      <Typography variant="body1" color="text.secondary">
                        {isLoadingStakedBalance ? (
                          <CircularProgress size={16} />
                        ) : (
                          `Staked Balance: ${formatEther(stakedBalance || 0n)} ETH`
                        )}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>

            {/* Withdraw Section */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(26, 26, 26, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(98,126,234,0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #627EEA, transparent)',
                    }
                  }}
                >
                  <Typography variant="h4" gutterBottom sx={{ 
                    color: '#627EEA',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    Withdraw ETH
                    <motion.div
                      animate={{
                        y: [0, 5, 0],
                        x: [0, -2, 2, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut"
                      }}
                    >
                      <Box sx={{
                        position: 'relative',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <motion.div
                          animate={{ 
                            boxShadow: [
                              '0 0 0px rgba(98,126,234,0.3)', 
                              '0 0 10px rgba(98,126,234,0.7)', 
                              '0 0 0px rgba(98,126,234,0.3)'
                            ] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                          }}
                        />
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/2048px-Ethereum-icon-purple.svg.png" 
                          alt="ETH"
                          style={{ width: '34px', height: '34px' }}
                        />
                      </Box>
                    </motion.div>
                  </Typography>
                  <Stack spacing={3} sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Amount to Withdraw"
                type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      disabled={!isConnected || isWithdrawing}
                      InputProps={{
                        inputProps: { min: 0, step: "0.000000000000000001" }
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={handleWithdraw}
                      disabled={!isConnected || !withdrawAmount || isWithdrawing}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(45deg, #627EEA, #8294ea)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5470ea, #7084ea)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                          transform: 'rotate(30deg)',
                          transition: 'all 0.6s ease',
                        },
                        '&:hover::before': {
                          transform: 'rotate(0deg)',
                        }
                      }}
                    >
                      {isWithdrawing ? <CircularProgress size={24} /> : 'Withdraw'}
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>

            {/* Rewards Section */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(0,255,157,0.05), rgba(255,0,255,0.05))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,0,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00ff9d, #ff00ff, transparent)',
                    }
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Typography variant="h4" gutterBottom sx={{
                      background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      VGB Rewards
                      <motion.div
                        style={{ position: 'relative' }}
                      >
                        <motion.div
                          animate={{ 
                            opacity: [0.2, 0.6, 0.2],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            top: -5,
                            left: -5,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundImage: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                            filter: 'blur(8px)'
                          }}
                        />
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          style={{ position: 'relative' }}
                        >
                          <Box
                            component="div"
                            sx={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              color: 'white',
                              position: 'relative'
                            }}
                          >
                            VGB
                          </Box>
                        </motion.div>
                      </motion.div>
                    </Typography>
                    {isConnected && (
                      <Typography variant="h5" sx={{ 
                        background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }} gutterBottom>
                        {isLoadingRewards ? (
                          <CircularProgress size={24} />
                        ) : (
                          `${formatEther(rewards || 0n)} VGB`
                        )}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => claimRewards()}
                      disabled={!isConnected || !rewards || rewards === 0n || isClaiming}
                      sx={{ 
                        minWidth: 200,
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'linear-gradient(45deg, #00ff9d, #ff00ff)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #00e090, #e600e6)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: -100,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          animation: 'buttonShimmer 3s infinite',
                        },
                        '@keyframes buttonShimmer': {
                          '0%': { left: '-100%' },
                          '100%': { left: '100%' }
                        }
                      }}
                    >
                      {isClaiming ? <CircularProgress size={24} /> : 'Claim Rewards'}
                    </Button>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
