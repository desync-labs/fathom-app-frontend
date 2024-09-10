import { Snackbar, styled, Typography } from "@mui/material";
import { InfoIcon } from "components/Governance/Propose";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";

const StyledSnackbar = styled(Snackbar)`
  &.MuiSnackbar-root {
    top: 75px;
    z-index: 9999;
  }
  & .MuiSnackbarContent-root {
    border-radius: 16px;
    border: 1px solid #5a0000;
    background: rgba(51, 13, 13);
    max-width: 600px;
    color: #f04242;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.14px;
    padding: 16px;
  }

  & .MuiSnackbarContent-action {
    gap: 8px;
    margin-right: 0;

    & button {
      height: 36px;
      font-size: 13px;
      line-height: 16px;
      font-weight: bold;
      padding: 0 16px;
    }
  }
`;

const MaintenanceModeBanner = () => {
  return (
    <StyledSnackbar
      open={true}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      message={
        <BaseFlexBox>
          <InfoIcon sx={{ width: "24px", color: "#f04242", height: "24px" }} />
          <Typography variant="body2">
            We’re working on dapp.fathom.fi right now. If you have trouble
            signing in or using tools, check back after we’re finished. Thank
            you for your patience.
          </Typography>
        </BaseFlexBox>
      }
    />
  );
};

export default MaintenanceModeBanner;
