import {
  Box,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, ReactNode } from "react";

interface TopInfoPanelItemProps {
  icon?: ReactNode;
  title: ReactNode;
  titleIcon?: ReactNode;
  children: ReactNode;
  hideIcon?: boolean;
  withoutIconWrapper?: boolean;
  variant?: "light" | "dark" | undefined; // default dark
  withLine?: boolean;
  loading?: boolean;
}

export const TopInfoPanelItem: FC<TopInfoPanelItemProps> = ({
  icon,
  title,
  titleIcon,
  children,
  hideIcon,
  variant = "dark",
  withLine,
  loading,
  withoutIconWrapper,
}) => {
  const theme = useTheme();
  const upToSM = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: "calc(50% - 12px)", xsm: "unset" },
      }}
    >
      {withLine && (
        <Box
          sx={{
            mr: 4,
            my: "auto",
            width: "1px",
            bgcolor: "#F2F3F729",
            height: "37px",
          }}
        />
      )}

      {!hideIcon &&
        (withoutIconWrapper ? (
          icon && icon
        ) : (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #EBEBED1F",
              borderRadius: "12px",
              bgcolor: "#383D51",
              boxShadow:
                "0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)",
              width: 42,
              height: 42,
              mr: 1.5,
            }}
          >
            {icon && icon}
          </Box>
        ))}

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <Typography
            sx={{ color: variant === "dark" ? "#A5A8B6" : "#62677B" }}
            variant={upToSM ? "description" : "caption"}
            component="div"
          >
            {title}
          </Typography>
          {titleIcon && titleIcon}
        </Box>

        {loading ? (
          <Skeleton
            width={60}
            height={upToSM ? 28 : 24}
            sx={{ background: "#383D51" }}
          />
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};
