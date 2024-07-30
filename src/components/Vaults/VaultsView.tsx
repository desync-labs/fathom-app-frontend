import { useMemo } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import {
  NestedRouteLink,
  NestedRouteNav,
} from "components/AppComponents/AppBox/AppBox";
import { TutorialIcon, VaultManagement } from "components/Common/MenuIcons";
import BasePageContainer from "components/Base/PageContainer";

const VaultsView = () => {
  const location = useLocation();
  const { vaultAddress } = useParams();

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
            <VaultManagement isactive={isVaultListActive ? "true" : ""} />
            Vault Management
          </NestedRouteLink>
          <NestedRouteLink
            className={isVaultTutorialActive ? "active" : ""}
            to="/vaults/tutorial"
          >
            <TutorialIcon isactive={isVaultTutorialActive ? "true" : ""} />
            Tutorial
          </NestedRouteLink>
        </NestedRouteNav>
      )}
      <BasePageContainer>
        <Outlet />
      </BasePageContainer>
    </>
  );
};

export default VaultsView;
