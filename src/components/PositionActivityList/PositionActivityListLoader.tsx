import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import useSharedContext from "context/shared";
import { CustomSkeleton } from "../Base/Skeletons/StyledSkeleton";

interface ListItemProps extends BoxProps {
  children: ReactNode;
  minHeight?: number;
  px?: number;
  button?: boolean;
}

interface ListColumnProps {
  children?: ReactNode;
  maxWidth?: number;
  minWidth?: number;
  isRow?: boolean;
  align?: "left" | "center" | "right";
  overFlow?: "hidden" | "visible";
  flex?: string | number;
  p?: string | number;
  gap?: number;
}

export const ListColumn: FC<ListColumnProps> = ({
  isRow,
  children,
  minWidth,
  maxWidth,
  align = "center",
  overFlow = "visible",
  flex = 1,
  p = 0.5,
  gap = 0,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        alignItems: isRow
          ? "center"
          : align === "left"
          ? "flex-start"
          : align === "right"
          ? "flex-end"
          : align,
        justifyContent: isRow ? "flex-start" : "flex-end",
        flex,
        minWidth: minWidth || "60px",
        maxWidth,
        overflow: overFlow,
        padding: p,
        gap,
      }}
    >
      {children}
    </Box>
  );
};

export const ListItem: FC<ListItemProps> = ({
  children,
  minHeight = 71,
  px = 2,
  button,
  ...rest
}) => {
  return (
    <Box
      {...rest}
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight,
        px,
        "&:not(:last-child)": {
          borderBottom: "1px solid",
          borderColor: "#3d5580",
        },
        ...(button ? { "&:hover": { bgcolor: "action.hover" } } : {}),
        ...rest.sx,
      }}
    >
      {children}
    </Box>
  );
};

const PositionListActivityRowItem = () => {
  const { isMobile } = useSharedContext();

  return (
    <ListItem
      minHeight={isMobile ? 68 : 85}
      sx={{ padding: isMobile ? "12px 16px" : "16px 24px 16px 48px" }}
    >
      <ListColumn maxWidth={200} align="left" p={isMobile ? 0 : 0.5} gap={1}>
        <CustomSkeleton
          width={isMobile ? 240 : 180}
          height={isMobile ? 16 : 20}
        />
        <CustomSkeleton width={isMobile ? 180 : 150} height={18} />
      </ListColumn>
      {!isMobile && (
        <ListColumn isRow align="center">
          <CustomSkeleton width={isMobile ? 80 : 230} height={24} />
        </ListColumn>
      )}
      <ListColumn align="right">
        <CustomSkeleton
          width={isMobile ? 44 : 77}
          height={isMobile ? 28 : 32}
        />
      </ListColumn>
    </ListItem>
  );
};

export const PositionActivityListLoader = ({
  txAmount = 1,
}: {
  txAmount?: number;
}) => {
  const { isMobile } = useSharedContext();
  return (
    <>
      <ListItem minHeight={56}>
        <ListColumn align="left">
          <CustomSkeleton width={100} height={isMobile ? 22 : 24} />
        </ListColumn>
      </ListItem>
      {Array.from({ length: txAmount }).map((_, index) => (
        <PositionListActivityRowItem key={index} />
      ))}
    </>
  );
};
