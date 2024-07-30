import { Grid, Typography, Box } from "@mui/material";
import { FC } from "react";
import { styled } from "@mui/material/styles";
import useSharedContext from "context/shared";

type PageHeaderType = {
  title: string;
  description: string;
  addPadding?: boolean;
};

const PageHeaderTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "addPadding",
})<{ addPadding?: boolean }>`
  font-weight: bold;
  font-size: 28px;
  color: #fff;
  line-height: 32px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
    padding-left: ${({ addPadding }) => (addPadding ? "15px" : 0)};
  }
`;

const PageHeaderDescription = styled(Box)`
  font-size: 14px;
  color: #fff;
  line-height: 20px;
`;
//ToDo: Replace the PageHeader with BasePageHeader and remove this file
export const PageHeader: FC<PageHeaderType> = ({
  title,
  description,
  addPadding,
}) => {
  const { isMobile } = useSharedContext();
  return (
    <Grid item xs={12} md={10} lg={8}>
      <PageHeaderTitle variant={"h6"} gutterBottom addPadding={addPadding}>
        {title}
      </PageHeaderTitle>
      {!isMobile && (
        <PageHeaderDescription
          dangerouslySetInnerHTML={{ __html: description }}
        ></PageHeaderDescription>
      )}
    </Grid>
  );
};
