import {
  styled,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";

const CustomToggleGroup = styled(ToggleButtonGroup)<ToggleButtonGroupProps>(
  {}
) as typeof ToggleButtonGroup;

const CustomTxModalToggleGroup = styled(
  ToggleButtonGroup
)<ToggleButtonGroupProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.header,
  padding: "2px",
  height: "36px",
  width: "100%",
})) as typeof ToggleButtonGroup;

export function StyledTxModalToggleGroup(props: ToggleButtonGroupProps) {
  return <CustomTxModalToggleGroup {...props} />;
}

export default function StyledToggleGroup(props: ToggleButtonGroupProps) {
  return <CustomToggleGroup {...props} />;
}
