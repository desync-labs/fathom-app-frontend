import {
  PERMISSION,
  PermissionManager,
} from "@into-the-fathom/lending-contract-helpers";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import {
  getProvider,
  isFeatureEnabled,
} from "apps/lending/utils/marketsAndNetworksConfig";

import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

type PermissionsContext = {
  permissions: PERMISSION[];
  isPermissionsLoading: boolean;
};

const Context = createContext<PermissionsContext>({
  permissions: [],
  isPermissionsLoading: false,
});

export const PermissionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentChainId: chainId, currentMarketData } =
    useProtocolDataContext();
  const { currentAccount: walletAddress } = useWeb3Context();
  const [isPermissionsLoading, setIsPermissionsLoading] =
    useState<boolean>(true);
  const [permissions, setPermissions] = useState<PERMISSION[]>([]);

  async function getPermissionData(permissionManagerAddress: string) {
    try {
      const instance = new PermissionManager({
        provider: getProvider(chainId),
        permissionManagerAddress: permissionManagerAddress,
      });
      const permissions = await instance.getHumanizedUserPermissions(
        walletAddress
      );
      setIsPermissionsLoading(true);
      setPermissions(permissions);
    } catch (e) {
      throw new Error("there was an error fetching your permissions");
    }
    setIsPermissionsLoading(false);
  }

  useEffect(() => {
    if (
      isFeatureEnabled.permissions(currentMarketData) &&
      walletAddress &&
      currentMarketData.addresses.PERMISSION_MANAGER
    ) {
      getPermissionData(currentMarketData.addresses.PERMISSION_MANAGER);
    } else {
      setIsPermissionsLoading(false);
    }
  }, [walletAddress, currentMarketData.addresses.PERMISSION_MANAGER]);

  return (
    <Context.Provider
      value={{
        permissions,
        isPermissionsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const usePermissions = () => useContext(Context);
