import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Link, SvgIcon, Typography } from "@mui/material";
import { ApprovalMethodToggleButton } from "apps/lending/components/transactions/FlowCommons/ApprovalMethodToggleButton";
import { MOCK_SIGNED_HASH } from "apps/lending/helpers/useTransactionHandler";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { ApprovalMethod } from "apps/lending/store/walletSlice";
import { FC } from "react";

export type RightHelperTextProps = {
  approvalHash?: string;
  tryPermit?: boolean;
};

const ExtLinkIcon = () => (
  <SvgIcon sx={{ ml: "2px", fontSize: "11px" }}>
    <OpenInNewIcon />
  </SvgIcon>
);

export const RightHelperText: FC<RightHelperTextProps> = ({
  approvalHash,
  tryPermit,
}) => {
  const { walletApprovalMethodPreference, setWalletApprovalMethodPreference } =
    useRootStore();
  const usingPermit = tryPermit && walletApprovalMethodPreference;
  const { currentNetworkConfig } = useProtocolDataContext();
  const isSigned = approvalHash === MOCK_SIGNED_HASH;
  // a signature is not submitted on-chain so there is no link to review
  if (!approvalHash && !isSigned && tryPermit)
    return (
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subheader2" color="text.secondary">
          Approve with&nbsp;
        </Typography>
        <ApprovalMethodToggleButton
          currentMethod={walletApprovalMethodPreference}
          setMethod={(method: ApprovalMethod) =>
            setWalletApprovalMethodPreference(method)
          }
        />
      </Box>
    );
  if (approvalHash && !usingPermit)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          pb: 1,
        }}
      >
        {approvalHash && (
          <Link
            variant="helperText"
            href={currentNetworkConfig.explorerLinkBuilder({
              tx: approvalHash,
            })}
            sx={{ display: "inline-flex", alignItems: "center" }}
            underline="hover"
            target="_blank"
            rel="noreferrer noopener"
          >
            Review approval tx details
            <ExtLinkIcon />
          </Link>
        )}
      </Box>
    );
  return <></>;
};
