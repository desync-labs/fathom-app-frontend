import { FC } from "react";
import { Button, SvgIcon, Typography } from "@mui/material";

import { NetworkConfig } from "apps/lending/ui-config/networksConfig";
import { Link } from "apps/lending/components/primitives/Link";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export const BridgeButton: FC<Pick<NetworkConfig, "bridge">> = ({ bridge }) => {
  if (!bridge) return null;

  return (
    <Button
      startIcon={
        <img
          src={bridge.icon}
          alt={bridge.name}
          style={{ width: 14, height: 14 }}
        />
      }
      endIcon={
        <SvgIcon component={OpenInNewIcon} sx={{ width: 13, height: 13 }} />
      }
      component={Link}
      size="small"
      variant="outlined"
      href={bridge.url || ""}
    >
      <Typography variant="buttonS">{bridge.name}</Typography>
    </Button>
  );
};
