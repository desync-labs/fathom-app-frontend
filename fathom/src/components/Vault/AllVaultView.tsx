import {
  Container,
  Grid
} from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import React from "react";
import useAllFarmsView from "hooks/useAllFarmsView";
import VaultList from "components/Vault/VaultList";


const AllVaultView = () => {
  const {
    farmsCurrentPage,
    farmsItemsCount,
    isMobile,
    setFarmsCurrentPage,
    setFarmsItemsCount,
  } = useAllFarmsView()

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          title={"Vault"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget tristique malesuada pulvinar commodo. Euismod massa. If this is the first-time you’re here, please visit our Whitepaper.`}
        />
        <Grid item xs={12} sx={{ marginTop: isMobile ? "5px" : "30px" }}>
          <VaultList
            positionCurrentPage={farmsCurrentPage}
            positionsItemsCount={farmsItemsCount}
            setPositionCurrentPage={setFarmsCurrentPage}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default AllVaultView