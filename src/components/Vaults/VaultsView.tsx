import { FC, MouseEvent, useMemo } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import {
  NestedRouteContainer,
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import useSharedContext from "context/shared";

type VaultsViewPropsType = {
  isMobileFiltersOpen: boolean;
  openMobileFilterMenu: (event: MouseEvent<HTMLElement>) => void;
};

const VaultsView: FC<VaultsViewPropsType> = () => {
  const location = useLocation();
  const { vaultAddress } = useParams();
  const { isMobile } = useSharedContext();

  const isVaultListActive = useMemo(() => {
    return location.pathname === "/vaults";
  }, [location.pathname]);

  const isVaultTutorialActive = useMemo(
    () => location.pathname.includes("tutorial"),
    [location.pathname]
  );

  const isVaultVaultDetail = useMemo(() => !!vaultAddress, [vaultAddress]);

  return (
    <>
      {!isVaultVaultDetail && (
        <NestedRouteNav>
          <NestedRouteLink
            className={isVaultListActive ? "active" : ""}
            to="/vaults"
          >
            Vault Management
          </NestedRouteLink>
          <NestedRouteLink
            className={isVaultTutorialActive ? "active" : ""}
            to="/vaults/tutorial"
          >
            Tutorial
          </NestedRouteLink>
        </NestedRouteNav>
      )}
      <NestedRouteContainer
        maxWidth="lg"
        sx={{
          mt: isMobile ? 2 : 4,
          mb: isMobile ? 2 : 4,
        }}
      >
        <Outlet />
      </NestedRouteContainer>
    </>
  );
};

export default VaultsView;
