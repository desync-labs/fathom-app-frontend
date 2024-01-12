import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, memo, ReactNode } from "react";

import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { ListHeader } from "apps/lending/modules/dashboard/lists/ListHeader";
import { ListItemLoader } from "apps/lending/modules/dashboard/lists/ListItemLoader";
import { MobileListItemLoader } from "apps/lending/modules/dashboard/lists/MobileListItemLoader";

interface ListLoaderProps {
  title: ReactNode;
  withTopMargin?: boolean;
  head: ReactNode[];
}

export const ListLoader: FC<ListLoaderProps> = memo(
  ({ title, withTopMargin, head }) => {
    const theme = useTheme();
    const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));

    return (
      <ListWrapper
        titleComponent={
          <Typography component="div" variant="h3" sx={{ mr: 4 }}>
            {title}
          </Typography>
        }
        withTopMargin={withTopMargin}
      >
        <>
          {!downToXSM && <ListHeader head={head} />}
          {!downToXSM ? (
            <>
              <ListItemLoader />
              <ListItemLoader />
            </>
          ) : (
            <MobileListItemLoader />
          )}
        </>
      </ListWrapper>
    );
  }
);
