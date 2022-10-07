import { Box, Grid, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { observer } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import logo from '../../assets/images/fxd-logo.png';
import { useStores } from '../../stores';

const ProtocolStats = observer(() => {
  const { chainId, error } = useWeb3React()
  const rootStore = useStores();
  const { fxdProtocolStatsStore }  = rootStore;
  const unsupportedError = useMemo(() => (error as Error) instanceof UnsupportedChainIdError, [error]);

  useEffect(() => {
    // Update the document title using the browser API
    if (chainId && (!error || !unsupportedError)) {
      setTimeout(() => {
        fxdProtocolStatsStore.fetchProtocolStats()
      })
    } 
  }, [fxdProtocolStatsStore, rootStore.alertStore,  chainId, error, unsupportedError]);
  
    return (
        <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 360,
        }}
      >
      <img src={logo} alt="Fathom Stablecoin"  height="40" width="80" color='black'></img>
      <Typography variant="subtitle1" gutterBottom>
          The reliable stablecoin that earns you extra passive income
      </Typography>
      <Typography variant="body2" gutterBottom>
            FXD is an auto-farming stablecoin that earns passive yields for you in the background.
            Now, instead of paying for loans,you can get loans while earning on your collateral.
      </Typography>
      <Grid container>
      <Box
        sx={{
          boxShadow: 2,
          width: '15rem',
          height: '5rem',
          bgcolor: '#000000',
          p: 1.5,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
       <Typography variant="subtitle1" color="text.secondary">
          Total Supply
       </Typography>
       <Typography variant="h6" color="primary" gutterBottom>
        {fxdProtocolStatsStore.commarize(fxdProtocolStatsStore.protocolStats.fathomSupplyCap)}
       </Typography>
      </Box>
      <Box
        sx={{
          boxShadow: 2,
          width: '15rem',
          height: '5rem',
          bgcolor: '#000000',
          p: 1.5,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
      <Typography variant="subtitle1" color="text.secondary">
          TVL
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
          {fxdProtocolStatsStore.getFormattedTVL()}
      </Typography>
      </Box>
      <Box
        sx={{
          boxShadow: 2,
          width: '15rem',
          height: '5rem',
          bgcolor: '#000000',
          p: 1.5,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
      <Typography variant="subtitle1" color="text.secondary">
          FXD Price
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        {fxdProtocolStatsStore.getFormattedFXDPriceRatio()}
      </Typography>
      </Box>
      <Box
        sx={{
          boxShadow: 2,
          width: '15rem',
          height: '5rem',
          bgcolor: '#000000',
          p: 1.5,
          m: 1,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
      <Typography variant="subtitle1" color="text.secondary">
          Liq. Ratio
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        {fxdProtocolStatsStore.getFormattedLiquidationRatio()}
      </Typography>
      </Box>
    </Grid>

      </Paper>

    );
  })

  export default ProtocolStats;