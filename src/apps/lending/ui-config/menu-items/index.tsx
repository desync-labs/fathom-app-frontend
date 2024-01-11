import { ROUTES } from "apps/lending/components/primitives/Link";
import { ENABLE_TESTNET } from "apps/lending/utils/marketsAndNetworksConfig";

import { MarketDataType } from "apps/lending/ui-config/marketsConfig";

interface Navigation {
  link: string;
  title: string;
  isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
}

export const navigation: Navigation[] = [
  {
    link: ROUTES.dashboard,
    title: "Dashboard",
    dataCy: "menuDashboard",
  },
  {
    link: ROUTES.markets,
    title: "Markets",
    dataCy: "menuMarkets",
  },
  {
    link: ROUTES.faucet,
    title: "Faucet",
    isVisible: () =>
      process.env.NEXT_PUBLIC_ENV === "staging" || ENABLE_TESTNET,
  },
];
