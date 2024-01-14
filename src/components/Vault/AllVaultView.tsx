import { FC, memo, MouseEvent } from "react";
import { Container, Grid } from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import VaultList from "components/Vault/VaultList";
import useSharedContext from "context/shared";

type AllVaultViewPropsType = {
  isMobileFiltersOpen: boolean;
  openMobileFilterMenu: (event: MouseEvent<HTMLElement>) => void;
};

const AllVaultView: FC<AllVaultViewPropsType> = ({
  isMobileFiltersOpen,
  openMobileFilterMenu,
}) => {
  const { isMobile } = useSharedContext();

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: isMobile ? 2 : 4,
        mb: isMobile ? 2 : 4,
      }}
    >
      <Grid container spacing={isMobile ? 1 : 3}>
        <PageHeader
          title={"Vault"}
          description={`Explore existing Vaults, and deposit your assets for a sustainable yield.`}
        />
        <Grid item xs={12} sx={{ marginTop: isMobile ? "5px" : "30px" }}>
          <VaultList
            isMobileFiltersOpen={isMobileFiltersOpen}
            openMobileFilterMenu={openMobileFilterMenu}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(AllVaultView);
