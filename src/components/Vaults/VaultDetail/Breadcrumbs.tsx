import { Link } from "react-router-dom";
import { Breadcrumbs, styled, Typography } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import useVaultContext from "context/vault";

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-top: 40px;
  margin-bottom: 40px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 24px;
    margin-bottom: 20px;

    & .MuiBreadcrumbs-separator {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
`;

const VaultBreadcrumbsLink = styled(Link)`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    color: #6d86b2;
    font-size: 12px;
  }
`;

const VaultBreadcrumbsCurrentPage = styled(Typography)`
  color: #6d86b2;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    color: #fff;
    font-size: 12px;
  }
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
    <BreadcrumbsWrapper
      separator={<KeyboardArrowRightRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </BreadcrumbsWrapper>
  );
};

export default VaultBreadcrumbs;
