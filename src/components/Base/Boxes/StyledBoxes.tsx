import { styled } from "@mui/material/styles";
import { Box as MuiBox, Box, Typography } from "@mui/material";

export const BaseInfoBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-top: 20px;

  svg {
    height: 20px;
    width: 20px;
    color: #b7c8e5;
    margin: 0;
  }

  p {
    color: #b7c8e5;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BaseWarningBox = styled(Box)`
  background: #452508;
  border: 1px solid #5c310a;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 20px;

  svg {
    color: #f7b06e;
  }

  p {
    color: #f7b06e;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BaseErrorBox = styled(MuiBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(51, 13, 13, 0.9);
  border: 1px solid #5a0000;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 20px 0;

  svg {
    width: 20px;
    height: 20px;
    color: #f04242;
    float: left;
    margin-right: 10px;
  }
  p {
    color: #f76e6e;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BaseErrorMessage = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: #ff8585;
`;
