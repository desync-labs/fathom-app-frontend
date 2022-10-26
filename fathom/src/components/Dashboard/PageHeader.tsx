import { Grid, Typography, Box } from "@mui/material";
import { FC } from "react";
import { styled } from "@mui/material/styles";

type PageHeaderType = {
  title: string;
  description: string;
};

const PageHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "28px",
  color: "#9FADC6",
  lineHeight: "32px",
}));
const PageHeaderDescription = styled(Box)(({ theme }) => ({
  fontSize: "14px",
  color: "#9FADC6",
  lineHeight: "20px",
}));

export const PageHeader: FC<PageHeaderType> = ({ title, description }) => {
  return (
    <Grid item xs={12} md={9} lg={7}>
      <PageHeaderTitle variant="h6" gutterBottom>
        {title}
      </PageHeaderTitle>
      <PageHeaderDescription>{description}</PageHeaderDescription>
    </Grid>
  );
};
