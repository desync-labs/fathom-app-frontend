import { Box, CircularProgress } from "@mui/material";
import {
  ExtendedFormattedUser,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import invariant from "tiny-invariant";
import { ReactNode } from "react";

interface UserAuthenticatedProps {
  children: (user: ExtendedFormattedUser) => ReactNode;
}

export const UserAuthenticated = ({ children }: UserAuthenticatedProps) => {
  const { user, loading } = useAppDataContext();
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  invariant(user, "User data loaded but no user found");
  return <>{children(user)}</>;
};
