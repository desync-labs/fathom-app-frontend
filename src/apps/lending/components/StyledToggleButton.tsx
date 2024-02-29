import { styled, ToggleButton, ToggleButtonProps } from "@mui/material";

const CustomToggleButton = styled(ToggleButton)<ToggleButtonProps>(
  ({ theme }) => ({
    border: "0px",
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: "unset",
    ".MuiTypography-subheader1": {
      color: theme.palette.text.primary,
    },
    ".MuiTypography-secondary14": {
      color: theme.palette.text.primary,
    },
    "&:hover": {
      backgroundColor: "transparent",
      border: "none",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "2px solid #43FFF1",
    },

    "&.Mui-selected, &.Mui-disabled": {
      zIndex: 100,
      height: "100%",
      display: "flex",
      justifyContent: "center",
    },
  })
) as typeof ToggleButton;

const CustomTxModalToggleButton = styled(ToggleButton)<ToggleButtonProps>(
  ({ theme }) => ({
    border: "0px",
    flex: 1,
    color: theme.palette.text.muted,
    borderRadius: "4px",

    "&.Mui-selected, &.Mui-selected:hover": {
      border: `1px solid ${theme.palette.other.standardInputLine}`,
      backgroundColor: theme.palette.other.fathomAccent,
      borderRadius: "4px !important",
    },

    "&.Mui-selected, &.Mui-disabled": {
      zIndex: 100,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      color: theme.palette.background.header,
    },
  })
) as typeof ToggleButton;

export function StyledTxModalToggleButton(props: ToggleButtonProps) {
  return <CustomTxModalToggleButton {...props} />;
}

export default function StyledToggleButton(props: ToggleButtonProps) {
  return <CustomToggleButton {...props} />;
}
