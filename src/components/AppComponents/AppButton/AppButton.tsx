import { styled } from "@mui/material/styles";
import { Box, IconButton, IconButton as MuiButton } from "@mui/material";
import { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton/IconButton";

interface ToggleDrawerButtonProps extends MuiIconButtonProps {
  open?: boolean;
}

export const ToggleDrawerButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "open",
})<ToggleDrawerButtonProps>(({ open }) => ({
  color: "#000",
  width: "20px",
  height: "20px",
  borderRadius: "20px",
  background: "#808084",
  padding: 0,
  position: "absolute",
  right: "-10px",
  transform: `rotate(${open ? "180deg" : "0deg"})`,
  transition: "transform 0.3s ease-in-out",
  "&:hover": { background: open ? "#3E3F45" : "#808084" },
}));

export const ButtonPrimary = styled(MuiButton, {
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
      color: "gray",
      background: "transparent",
      borderColor: "gray",
      cursor: "not-allowed !important",
      pointerEvents: "all !important",
    };
  }

  return styles;
});

export const ButtonSecondary = styled(MuiButton)`
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
    svg: {
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

export const SkipButton = styled(MuiButton)`
  background: rgba(143, 36, 36, 0.25);
  border-radius: 8px;
  height: 48px;
  width: 100%;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  color: #f76e6e;
`;

export const CancelButton = styled(IconButton)`
  height: 48px;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  color: #fff;
  border: 1px solid #6379a1;
  border-radius: 8px;
`;

export const OpenPositionButton = styled(MuiButton)`
  border-radius: 8px;
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  padding: 8px 12px 8px 12px;
  height: 32px;
  font-size: 13px;
  line-height: 16px;
  font-weight: bold;
  color: #00332f;
  border: 1px solid #b3fff9;
  margin-right: 25px;
  &:hover {
    background: transparent;
    color: #b3fff9;
    border: 1px solid #b3fff9;
    pointer-events: all !important;
    cursor: pointer;
    svg: {
      color: #b3fff9;
    }
  }
`;

export const ManagePositionButton = styled(MuiButton)`
  border: 0.7px solid #43FFF1;
  border-radius: 8px;
  background: transparent;
  padding: 8px 12px;
  color: #43FFF1;
  font-size: 13px;
  line-height: 16px;
  height: 32px;
  min-width: 118px;
  &:hover {
    background: transparent;
    color: #B3FFF9;
    border: 1px solid #B3FFF9;
    svg: {
      color: #B3FFF9;
    },
  }
`;

export const MaxButton = styled(MuiButton)`
  background: rgba(50, 69, 103, 0.3);
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  position: absolute;
  top: 23px;
  right: 7px;
  cursor: pointer;
`;
export const MaxButtonV2 = styled(MuiButton)`
  color: #43fff1;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    background: transparent;
  }
`;

export const ApproveButton = styled(MuiButton)`
  color: #00332f;
  font-weight: bold;
  font-size: 13px;
  line-height: 16px;
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  border: 1px solid #b3fff9;
  border-radius: 8px;
  margin-left: 33px;
  margin-top: 15px;
  min-width: 80px;
  height: 28px;
`;

export const ButtonsWrapper = styled(Box)`
  display: flex;
  gap: 10px;
  position: absolute;
  right: 0;
  bottom: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    position: static;
    display: block;
    > button {
      width: 100%;
      margin-bottom: 10px;
    }
  }
`;

export const ModalButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 20px;

  & > button {
    height: 48px;
    font-size: 17px;
    font-weight: 600;
    padding: 8px 32px;

    &:first-child {
      width: 118px;
    }
    &:last-child {
      width: calc(100% - 128px);
    }
  }
`;

export const ManagePositionRepayTypeWrapper = styled(Box)`
  margin-bottom: 20px;
`;

export const ManageTypeButton = styled(MuiButton)`
  border: 1px solid #6987b8;
  border-radius: 8px;
  align-items: center;
  height: 40px;
  width: 49%;
  color: #fff;
  font-size: 15px;
  line-height: 20px;
  font-weight: bold;
  &.active {
    background: #4f658c;
    border: 1px solid #6379a1;
  }
`;

export const FathomSwapChangeCurrencyButton = styled(MuiButton)`
  width: 40px;
  height: 40px;
  background: #131f35;
  border: 1px solid #131f35;
  border-radius: 8px;
  left: calc(50% - 40px / 2);
  top: calc(100% - 40px / 2 + 6px);
  z-index: 1;
  position: absolute;
`;

export const BackToProposalsButton = styled(MuiButton)`
  font-size: 15px;
  line-height: 20px;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  :hover {
    background: none;
  }
`;

export const VotingEndedButton = styled(MuiButton)`
  padding: 8px 20px;
  width: 100%;
  color: #6379a1;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  &.Mui-disabled {
    background: #324567;
    border-radius: 8px;
  }
`;

export const FarmFilterMobileBtn = styled(MuiButton)`
  width: 44px;
  height: 44px;
  background: rgba(79, 101, 140, 0.2);
  border-radius: 8px;
`;
