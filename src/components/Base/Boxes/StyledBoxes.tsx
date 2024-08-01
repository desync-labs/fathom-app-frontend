import { styled } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";

export const BaseInfoBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-top: 16px;

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
  margin-top: 16px;

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

export const BaseErrorBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(51, 13, 13, 0.9);
  border: 1px solid #5a0000;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;

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

export const BaseTagLabel = styled("span")`
  color: #43fff1;
  font-size: 11px;
  line-height: 12px;
  border: 1px solid #43fff1;
  border-radius: 8px;
  background: transparent;
  padding: 4px 8px;
`;

export const BaseErrorMessage = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: #ff8585;
`;

export const BaseFlexBox = styled(Stack)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
