import { FC, memo } from "react";
import { Box, styled, Typography } from "@mui/material";

const PageHeaderWrapper = styled(Box)`
  padding-top: 6px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding-top: 9px;
  }
`;

const PageTitle = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
  }
`;

const PageDescription = styled(Box)`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.14px;
  margin-top: 12px;
  margin-bottom: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 13px;
    margin-top: 2px;
  }
`;

type PageHeaderType = {
  title: string;
  description?: string;
};

const BasePageHeader: FC<PageHeaderType> = ({ title, description }) => {
  return (
    <PageHeaderWrapper>
      <PageTitle variant={"h1"}>{title}</PageTitle>
      {description && (
        <PageDescription
          dangerouslySetInnerHTML={{ __html: description }}
        ></PageDescription>
      )}
    </PageHeaderWrapper>
  );
};

export default memo(BasePageHeader);
