import { Box, Divider, Grid, ListItemText } from "@mui/material";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

const DepositVaultInfo = ({ vaultItemData, deposit, sharedToken }: any) => {
  const { token, shareToken } = vaultItemData;
  return (
    <Grid item xs={12} sm={6} pr={2.5}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {token.name + " "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {deposit + " " + token.name}
              </Box>
            </>
          }
        >
          <ListItemText primary={token.name + " Deposited"} />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 %{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → 72.88 %
              </Box>
            </>
          }
        >
          <ListItemText primary="Pool share" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              0 {shareToken.name + " "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {deposit + " " + shareToken.name}
              </Box>
            </>
          }
        >
          <ListItemText primary="Share tokens" />
        </AppListItem>
        <Divider />
        <AppListItem alignItems="flex-start" secondaryAction="1%">
          <ListItemText primary="Fee" />
        </AppListItem>
        <Divider />
        <AppListItem alignItems="flex-start" secondaryAction="0%">
          <ListItemText primary="Estimated APR" />
        </AppListItem>
        <AppListItem alignItems="flex-start" secondaryAction="0%">
          <ListItemText primary="Historical APR" />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default DepositVaultInfo;
