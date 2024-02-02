import { ExclamationCircleIcon, LogoutIcon } from "@heroicons/react/outline";
import { Box, Button, SvgIcon, Typography } from "@mui/material";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { FC } from "react";

export interface AddressBlockedProps {
  address: string;
  onDisconnectWallet: () => void;
}

export const AddressBlockedModal: FC<AddressBlockedProps> = ({
  address,
  onDisconnectWallet,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  const setOpen = (_value: boolean) => {}; // ignore, we want the modal to not be dismissable

  return (
    <BasicModal open={true} withCloseButton={false} setOpen={setOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SvgIcon sx={{ fontSize: "24px", color: "warning.main", mb: 2 }}>
          <ExclamationCircleIcon />
        </SvgIcon>
        <Typography variant="h2">Blocked Address</Typography>
        <Typography variant="helperText" sx={{ my: 4 }}>
          {address}
        </Typography>
        <Typography variant="description" sx={{ textAlign: "center", mb: 4 }}>
          This address is blocked on Fathom lending because it is associated
          with one or more blocked activities.
        </Typography>
        <Button variant="gradient" onClick={onDisconnectWallet}>
          <SvgIcon fontSize="small" sx={{ mx: 1 }}>
            <LogoutIcon />
          </SvgIcon>
          Disconnect Wallet
        </Button>
      </Box>
    </BasicModal>
  );
};
