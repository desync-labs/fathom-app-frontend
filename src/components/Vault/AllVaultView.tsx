import React from "react";
import { Container, Grid, useMediaQuery, useTheme } from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import VaultList from "components/Vault/VaultList";

const AllVaultView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4 }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          title={"Vault"}
          description={`Explore existing Vaults, and deposit your assets for a sustainable yield.`}
        />
        <Grid item xs={12} sx={{ marginTop: isMobile ? "5px" : "30px" }}>
          <VaultList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllVaultView;
