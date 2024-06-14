import { FC, memo, MouseEvent } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { PageHeader } from "components/Dashboard/PageHeader";
import VaultList from "components/Vault/VaultList";
import useSharedContext from "context/shared";
import { InfoIcon } from "../Governance/Propose";
import { WarningBox } from "../AppComponents/AppBox/AppBox";

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
          title={"Vaults"}
          description={`Explore existing Vaults, and deposit your assets for a sustainable yield.`}
        />
        <Grid item xs={12} lg={8}>
          <WarningBox sx={{ my: 3 }}>
            <InfoIcon
              sx={{ width: "16px", color: "#F5953D", height: "16px" }}
            />
            <Typography>
              The new vault, created in partnership with TradeFlow, will launch
              soon this month. <br />
              Ensure you're eligible to participate by completing KYC at{" "}
              <a
                href={"https://kyc.tradeflow.network/"}
                target={"_blank"}
                rel={"noreferrer"}
              >
                https://kyc.tradeflow.network/
              </a>
              .
              <br />
              Only KYC-verified users can deposit. Note: Participation and
              deposit amounts are limited.
            </Typography>
          </WarningBox>
        </Grid>
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
