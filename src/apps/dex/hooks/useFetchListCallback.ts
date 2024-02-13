import { nanoid } from "@reduxjs/toolkit";
import { TokenList } from "@uniswap/token-lists";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "apps/dex/state";
import { fetchTokenList } from "apps/dex/state/lists/actions";
import getTokenList from "apps/dex/utils/getTokenList";
import resolveENSContentHash from "apps/dex/utils/resolveENSContentHash";
import { useActiveWeb3React } from "apps/dex/hooks/index";
import { Web3Provider } from "@into-the-fathom/providers";

export function useFetchListCallback(): (
  listUrl: string,
  sendDispatch?: boolean
) => Promise<TokenList> {
  const { library } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  const ensResolver = useCallback(
    (ensName: string) => {
      return resolveENSContentHash(ensName, library as Web3Provider);
    },
    [library]
  );

  // note: prevent dispatch if using for a list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid();
      sendDispatch &&
        dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch &&
            dispatch(
              fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId })
            );
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            );
          throw error;
        });
    },
    [dispatch, ensResolver]
  );
}
