import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import {
  Button,
  Link,
  Popper,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import BigNumber from "bignumber.js";
import { FC, memo, useMemo } from "react";
import { useRootStore } from "apps/lending/store/root";
import { DASHBOARD } from "apps/lending/utils/mixPanelEvents";

import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";

const PopperComponent = styled(Popper)(({ theme }) =>
  theme.unstable_sx({
    ".MuiTooltip-tooltip": {
      color: "text.primary",
      backgroundColor: "background.paper",
      p: 0,
      borderRadius: "6px",
      boxShadow:
        "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "300px",
    },
    ".MuiTooltip-arrow": {
      color: "background.paper",
      "&:before": {
        boxShadow:
          "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  })
);

const SvgIconStyle = {
  fontSize: "14px",
  zIndex: 2,
  position: "absolute",
  left: 5,
  transition: "all 0.2s easy",
};

interface Props {
  healthFactor: string;
  marketName: string;
  integrationURL: string;
}

const HALLink: FC<Props> = ({ healthFactor, marketName, integrationURL }) => {
  const { currentAccount } = useWeb3Context();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const urlString = useMemo(() => {
    const formattedHealthFactor = valueToBigNumber(healthFactor).toFixed(
      2,
      BigNumber.ROUND_DOWN
    );

    const url = new URL(integrationURL);
    url.searchParams.set("user", currentAccount);
    url.searchParams.set("healthfactor", formattedHealthFactor);
    url.searchParams.set("chain", marketName);
    url.searchParams.set("fathomversion", marketName);
    url.searchParams.set("utm_source", "fathom-integration");

    return url.toString();
  }, [currentAccount, healthFactor, marketName, integrationURL]);

  return (
    <Tooltip
      arrow
      placement="top"
      PopperComponent={PopperComponent}
      title={
        <Stack sx={{ py: 4, px: 6 }} spacing={1}>
          <Typography variant="tooltip" color="text.secondary" fontWeight={500}>
            Setup notifications about your Health Factor using the Hal app.
          </Typography>
        </Stack>
      }
    >
      <Button
        href={urlString}
        variant="surface"
        size="small"
        target="_blank"
        rel="noopener"
        component={Link}
        onClick={() =>
          trackEvent(DASHBOARD.NOTIFY_DASHBOARD, {
            market: marketName,
            healthFactor: healthFactor,
          })
        }
        sx={{
          pl: 6,
          position: "relative",
          "&:hover": {
            ".HALTooltip__icon": { opacity: 0 },
            ".HALTooltip__hoverIcon": { opacity: 1 },
          },
        }}
      >
        <SvgIcon
          sx={{ opacity: 1, ...SvgIconStyle }}
          className="HALTooltip__icon"
        >
          <img src={"./icons/icons/healthFactor/HAL.svg"} alt={"hal"} />
        </SvgIcon>
        <SvgIcon
          sx={{ opacity: 0, ...SvgIconStyle }}
          className="HALTooltip__hoverIcon"
        >
          <img src={"./icons/healthFactor/HALHover.svg"} alt={"hal"} />
        </SvgIcon>
        Notify
      </Button>
    </Tooltip>
  );
};

export default memo(HALLink);
