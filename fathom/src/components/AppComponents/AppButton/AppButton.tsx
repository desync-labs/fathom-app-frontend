import { styled } from "@mui/material/styles";
import { IconButton as MuiIconButton } from "@mui/material";
import { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton/IconButton";

interface ToggleDrawerButtonProps extends MuiIconButtonProps {
  open?: boolean;
}

export const ToggleDrawerButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== "open",
})<ToggleDrawerButtonProps>(({ theme, open }) => ({
  color: "#000",
  width: "20px",
  height: "20px",
  borderRadius: "20px",
  background: open ? "#808084" : "#3E3F45",
  padding: 0,
  position: "absolute",
  right: "-10px",
  "&:hover": { background: open ? "#3E3F45" : "#808084" },
}));
