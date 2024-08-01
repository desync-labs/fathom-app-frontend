import { styled } from "@mui/material/styles";
import { Box, IconButton as MuiButton, ToggleButtonGroup } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

export const BaseButtonsSwitcherGroup = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: stretch;
  width: 100%;
  height: fit-content;
  background: #091433;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 16px;
`;

export const BaseSwitcherButton = styled(MuiButton)`
  align-items: center;
  height: 40px;
  width: calc(50% - 4px);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: transparent;
  &.active {
    background: #3d5580;
  }
`;

export const BaseButtonPrimary = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "isLoading",
})<{ isLoading?: boolean }>(({ isLoading = false }) => {
  const styles = {
    borderRadius: "8px",
    background: "linear-gradient(104.04deg, #B3FFF9 0%, #00DBCB 100%)",
    padding: "8, 12, 8, 12",
    fontSize: "13px",
    lineHeight: "16px",
    fontWeight: "bold",
    color: "#00332F",
    border: "1px solid #B3FFF9",
    height: "40px",
    "&:hover": {
      background: "transparent",
      color: "#B3FFF9",
      border: "1px solid #B3FFF9",
      cursor: "pointer",
      pointerEvents: "all !important",
      svg: {
        color: "#B3FFF9",
      },
    },
    "> .MuiCircularProgress-root": {
      color: "#1D2D49",
    },
  };

  if (!isLoading) {
    (styles as any)["&:disabled"] = {
      color: "#B7C8E5",
      background: "transparent",
      borderColor: "#6D86B2",
      cursor: "not-allowed !important",
      pointerEvents: "all !important",
    };
  }

  return styles;
});

export const BaseButtonSecondary = styled(MuiButton)`
  color: #43FFF1;
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
  padding: 8px 16px;
  gap: 8px;
  border: 1px solid #009E92;
  border-radius: 8px;
  height: 40px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    & svg {
      color: #B3FFF9;
    }, 
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important; 
  }
`;

export const BaseButtonPrimaryLink = styled("a")`
  display: flex;
  align-items: center;
  height: 36px;
  width: fit-content;
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  color: #00332f;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 6px 20px;

  &:hover {
    background: transparent;
    color: #b3fff9;
    border: 1px solid #b3fff9;
    cursor: pointer;
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 28px;
    font-size: 11px;
    padding: 8px;
  }
`;

export const BaseButtonSecondaryLink = styled("a")`
  display: flex;
  align-items: center;  
  color: #43FFF1;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  padding: 8px 16px;
  gap: 8px;
  border: 1px solid #009E92;
  border-radius: 8px;
  height: 36px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    svg {
      color: #B3FFF9;
    }, 
  }
  &:disabled {
    color: gray;
    background: transparent;
    border-color: gray;
    cursor: not-allowed !important;
    pointer-events: all !important; 
  }
  
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 28px;
    font-size: 11px;
    padding: 8px;
  }
`;

export const ExtLinkIcon = styled(OpenInNewRoundedIcon, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ width?: string; height?: string }>`
  width: ${({ width = "16px" }) => width};
  height: ${({ height = "16px" }) => height};
  color: #43fff1;
  margin-left: 4px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-left: 0;
  }
`;

export const BaseToggleButtonGroup = styled(ToggleButtonGroup)`
  gap: 8px;
  width: 100%;

  & .MuiToggleButtonGroup-middleButton,
  & .MuiToggleButtonGroup-lastButton {
    border-left: 1px solid #2c4066 !important;
    margin-left: 0 !important;
  }

  & .MuiToggleButton-root {
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    border-radius: 6px;
    background: rgba(79, 101, 140, 0.3);
    padding: 4px 8px;
    width: 25%;

    &.Mui-selected {
      background: transparent;

      &:hover {
        background: rgba(79, 101, 140, 0.1);
      }
    }

    &:hover {
      background: rgba(79, 101, 140, 0.1);
    }
  }
`;
