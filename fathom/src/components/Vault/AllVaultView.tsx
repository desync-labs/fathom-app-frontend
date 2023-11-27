import React, { useEffect } from "react";
import { Container, Grid } from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import useAllVaultView from "hooks/useAllVaultView";
import VaultList from "components/Vault/VaultList";

const AllVaultView = () => {
  const {
    vaultCurrentPage,
    vaultItemsCount,
    isMobile,
    setVaultCurrentPage,
    setVaultItemsCount,
  } = useAllVaultView();

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
            vaultCurrentPage={vaultCurrentPage}
            vaultItemsCount={vaultItemsCount}
            setVaultCurrentPage={setVaultCurrentPage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllVaultView;
