import { getTokenLogoURL } from "apps/dex/components/CurrencyLogo";
import { wrappedCurrency } from "apps/dex/utils/wrappedCurrency";
import { Currency, Token } from "into-the-fathom-swap-sdk";
import { useCallback, useState } from "react";
import { useActiveWeb3React } from "apps/dex/hooks";

export default function useAddTokenToMetamask(
  currencyToAdd: Currency | undefined
): { addToken: () => void; success: boolean | undefined } {
  const { library, chainId } = useActiveWeb3React();

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId);

  const [success, setSuccess] = useState<boolean | undefined>();

  const addToken = useCallback(() => {
    if (
      library &&
      library.provider.isMetaMask &&
      library.provider.request &&
      token
    ) {
      library.provider
        .request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: getTokenLogoURL(token.address),
            },
          } as any,
        })
        .then((success) => {
          setSuccess(success);
        })
        .catch(() => setSuccess(false));
    } else {
      setSuccess(false);
    }
  }, [library, token]);

  return { addToken, success };
}
