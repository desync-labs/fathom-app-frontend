import React from "react";
import { Grid, Container } from "@mui/material";
import PositionsList from "components/PositionList/PositionsList";
import { observer } from "mobx-react";
import ProtocolStats from "components/Dashboard/ProtocolStats";
import PoolsListView from "components/Pools/PoolsListView";
import { PageHeader } from "components/Dashboard/PageHeader";
import useDashboard from "hooks/useDashboard";

const DashboardContent = observer(() => {
  const {
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
  } = useDashboard();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <PageHeader
          title={"FXD"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget tristique malesuada pulvinar commodo. Euismod massa, dis metus mattis porttitor ac est quis. Ut quis cursus ac nunc, aliquam curabitur nisl amet. Elit etiam dignissim orci. If this is the first-time you’re here, please <a href="/">visit our Whitepaper.</a`}
        />
        <Grid item xs={12}>
          <ProtocolStats />
        </Grid>
        <Grid item xs={12}>
          <PoolsListView />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "30px" }}>
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
});

export default DashboardContent;
