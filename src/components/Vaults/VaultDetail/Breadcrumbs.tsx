import { Link } from "react-router-dom";
import { Breadcrumbs, styled, Typography } from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import useVaultContext from "context/vault";
import { CustomSkeleton } from "components/Base/Skeletons/StyledSkeleton";

export const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-top: 8px;
  margin-bottom: 40px;
  .close {
    float: right;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 0;
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

export const VaultBreadcrumbsCurrentPage = styled(Typography)`
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
  const { vault, vaultLoading } = useVaultContext();
  const breadcrumbs = [
    <VaultBreadcrumbsLink key="1" color="inherit" to={"/vaults"}>
      Vaults
    </VaultBreadcrumbsLink>,
    vaultLoading || !vault.id ? (
      <CustomSkeleton key="2" width="80px" />
    ) : (
      <VaultBreadcrumbsCurrentPage key="2">
        {vault?.name}
      </VaultBreadcrumbsCurrentPage>
    ),
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
