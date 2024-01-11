import { Box, Button, Link, Typography } from "@mui/material";
import { useModalContext } from "apps/lending/hooks/useModal";

export const PermissionView = () => {
  const { close } = useModalContext();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: "92px",
        }}
      >
        <Typography sx={{ mt: 14 }} variant="h2">
          Allowance required action
        </Typography>
        <Typography sx={{ mt: "10px", textAlign: "center" }}>
          To request access for this permissioned market, please visit:{" "}
          <Link href={"https://access-provider-url"}>Acces Provider Name</Link>
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 12 }}>
        <Button
          onClick={close}
          variant="gradient"
          size="large"
          sx={{ minHeight: "44px" }}
        >
          Close
        </Button>
      </Box>
    </>
  );
};
