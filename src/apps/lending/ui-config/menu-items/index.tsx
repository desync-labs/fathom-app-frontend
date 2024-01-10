import { t } from "@lingui/macro";
import { ROUTES } from "src/components/primitives/Link";
import { ENABLE_TESTNET } from "src/utils/marketsAndNetworksConfig";

import { MarketDataType } from "../marketsConfig";

interface Navigation {
  link: string;
  title: string;
  isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
}

export const navigation: Navigation[] = [
  {
    link: ROUTES.dashboard,
    title: t`Dashboard`,
    dataCy: "menuDashboard",
  },
  {
    link: ROUTES.markets,
    title: t`Markets`,
    dataCy: "menuMarkets",
  },
  {
    link: ROUTES.faucet,
    title: t`Faucet`,
    isVisible: () =>
      process.env.NEXT_PUBLIC_ENV === "staging" || ENABLE_TESTNET,
  },
];
