import { Slider, styled } from "@mui/material";

export const BaseSlider = styled(Slider)`
  height: 8px;
  padding: 12px 0;

  & .MuiSlider-thumb {
    height: 16px;
    width: 16px;
    border: 2px solid #00332f;
  }

  & .MuiSlider-track {
    border: none;
  }
`;
