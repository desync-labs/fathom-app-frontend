import { Box, Container, ContainerProps } from "@mui/material";
import { FC, ReactNode } from "react";

import {
  PageTitle,
  PageTitleProps,
} from "apps/lending/components/TopInfoPanel/PageTitle";

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
}

export const TopInfoPanel: FC<TopInfoPanelProps> = ({
  pageTitle,
  titleComponent,
  withMarketSwitcher,
  bridge,
  children,
  containerProps = {},
}) => {
  return (
    <Box
      sx={{
        pt: { xs: 5, md: 6 },
        pb: { xs: 9, md: 10, lg: "94px", xl: "92px", xxl: "96px" },
        color: "#F1F1F3",
      }}
    >
      <Container {...containerProps} sx={{ ...containerProps.sx, pb: 0 }}>
        <Box sx={{ px: { xs: 0, xsm: 3 } }}>
          {!titleComponent && (
            <PageTitle
              pageTitle={pageTitle}
              withMarketSwitcher={withMarketSwitcher}
              bridge={bridge}
            />
          )}

          {titleComponent && titleComponent}

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: { xs: 2, xsm: 4 },
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
