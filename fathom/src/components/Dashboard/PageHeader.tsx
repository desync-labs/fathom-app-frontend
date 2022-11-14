import { Grid, Typography, Box } from "@mui/material";
import { FC } from "react";
import { styled } from "@mui/material/styles";

type PageHeaderType = {
  title: string;
  description: string;
};

const PageHeaderTitle = styled(Typography)`
  font-weight: bold;
  font-size: 28px;
  color: #fff;
  line-height: 32px;
`;

const PageHeaderDescription = styled(Box)`
  font-size: 14px;
  color: #fff;
  lineHeight: 20px;
`

export const PageHeader: FC<PageHeaderType> = ({ title, description }) => {
  return (
    <Grid item xs={12} md={10} lg={8}>
      <PageHeaderTitle variant="h6" gutterBottom>
        {title}
      </PageHeaderTitle>
      <PageHeaderDescription
        dangerouslySetInnerHTML={{ __html: description }}
      ></PageHeaderDescription>
    </Grid>
  );
};
