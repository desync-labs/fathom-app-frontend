import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, SvgIcon, Typography } from "@mui/material";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

import { DarkTooltip } from "apps/lending/components/infoTooltips/DarkTooltip";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";

export const FaucetButton = () => {
  const { currentNetworkConfig } = useProtocolDataContext();

  return (
    <DarkTooltip title="Get free assets to test the Fathom Protocol">
      <Button
        startIcon={
          <img
            src={currentNetworkConfig.networkLogoPath}
            alt={currentNetworkConfig.name}
            style={{ width: 14, height: 14 }}
          />
        }
        endIcon={
          <SvgIcon sx={{ width: 14, height: 14 }}>
            <OpenInNewIcon />
          </SvgIcon>
        }
        component={Link}
        href={ROUTES.faucet}
        variant="outlined"
        size="small"
      >
        <Typography variant="buttonS">
          {currentNetworkConfig.name} Faucet
        </Typography>
      </Button>
    </DarkTooltip>
  );
};
