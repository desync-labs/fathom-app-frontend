import { FC, ReactNode, useEffect, useRef } from "react";
import { Box, Grid } from "@mui/material";
import useSharedContext from "context/shared";
import usePricesContext from "context/prices";
import useWindowResize from "hooks/General/useWindowResize";

interface BasePageStatsWrapperProps {
  isLoading?: boolean;
  children: ReactNode;
}

const BasePageStatsWrapper: FC<BasePageStatsWrapperProps> = ({
  isLoading = false,
  children,
}) => {
  const container = useRef<HTMLElement>(null);
  const { isMobile } = useSharedContext();
  const { fetchPricesInProgress } = usePricesContext();
  const [width, height] = useWindowResize();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (container.current && !isLoading) {
      timer = setTimeout(() => {
        const blocks = (container.current as HTMLElement).querySelectorAll(
          ".page-stats-item"
        );
        const heights: number[] = [];
        blocks.forEach((block) => {
          const childs = (block.firstChild as HTMLElement).getElementsByTagName(
            "div"
          );
          const totalHeight = Array.from(childs)
            .slice(0, 2)
            .reduce(
              (accumulator, currentItem) =>
                accumulator + currentItem.offsetHeight,
              0
            );

          /**
           * 24 is the padding of the parent element
           */
          heights.push(totalHeight + 24);
        });
        const maxHeight = Math.max(...heights);
        blocks.forEach((block) => {
          (block.firstChild as HTMLElement).style.height = `${maxHeight}px`;
          (block as HTMLElement).style.height = `${maxHeight + 12}px`;
        });
      });
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [container, isLoading, fetchPricesInProgress, width, height]);

  return (
    <Box ref={container}>
      <Grid container spacing={isMobile ? 0.5 : 1.5}>
        {children}
      </Grid>
    </Box>
  );
};

export default BasePageStatsWrapper;
