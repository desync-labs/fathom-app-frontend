import React from "react";
import { Grid, Container } from "@mui/material";
import PositionsList from "components/PositionList/PositionsList";
import ProtocolStats from "components/Dashboard/ProtocolStats";
import PoolsListView from "components/Pools/PoolsListView";
import { PageHeader } from "components/Dashboard/PageHeader";
import useDashboard from "hooks/useDashboard";

const DashboardContent = () => {
  const {
    isMobile,
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
  } = useDashboard();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          title={"FXD"}
          description={`FXD is overcollateralized, decentralized, and softly pegged stablecoin.`}
        />
        <Grid item xs={12}>
          <ProtocolStats />
        </Grid>
        <Grid item xs={12}>
          <PoolsListView proxyWallet={proxyWallet} />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: isMobile ? "5px" : "30px" }}>
          <PositionsList
            positionCurrentPage={positionCurrentPage}
            positionsItemsCount={positionsItemsCount}
            proxyWallet={proxyWallet}
            setPositionCurrentPage={setPositionCurrentPage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardContent;
