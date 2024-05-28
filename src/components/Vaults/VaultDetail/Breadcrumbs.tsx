import { Link } from "react-router-dom";
import { Breadcrumbs, styled, Typography } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import useVaultContext from "context/vault";

const VaultBreadcrumbsLink = styled(Link)`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const VaultBreadcrumbsCurrentPage = styled(Typography)`
  color: #6d86b2;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const VaultBreadcrumbs = () => {
  const { vault } = useVaultContext();
  const breadcrumbs = [
    <VaultBreadcrumbsLink key="1" color="inherit" to={"/vaults"}>
      Vaults
    </VaultBreadcrumbsLink>,
    <VaultBreadcrumbsCurrentPage key="2">
      {vault?.name}
    </VaultBreadcrumbsCurrentPage>,
  ];

  return (
    <Breadcrumbs
      separator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ my: "40px" }}
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

export default VaultBreadcrumbs;
