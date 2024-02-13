import { useAllLists } from "apps/dex/state/lists/hooks";
import {
  getVersionUpgrade,
  minVersionBump,
  VersionUpgrade,
} from "@uniswap/token-lists";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useFetchListCallback } from "apps/dex/hooks/useFetchListCallback";
import useInterval from "apps/dex/hooks/useInterval";
import useIsWindowVisible from "apps/dex/hooks/useIsWindowVisible";
import { AppDispatch } from "apps/dex/state";
import { acceptListUpdate } from "./actions";
import { useActiveListUrls } from "./hooks";
import { useAllInactiveTokens } from "apps/dex/hooks/Tokens";
import { SUPPORTED_LIST_URLS } from "apps/dex/constants/lists";

export default function Updater(): null {
  const { library } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const isWindowVisible = useIsWindowVisible();

  // get all loaded lists, and the active urls
  const lists = useAllLists();
  const activeListUrls = useActiveListUrls();

  const [loading, setLoading] = useState(true);

  // initiate loading
  useAllInactiveTokens();

  const fetchList = useFetchListCallback();
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;
    if (loading) return;
    const promises: Promise<any>[] = [];
    setLoading(true);
    Object.keys(lists).forEach((url) =>
      promises.push(
        fetchList(url).catch((error) =>
          console.debug("interval list fetching error", error)
        )
      )
    );

    Promise.all(promises).finally(() => setLoading(false));
  }, [loading, fetchList, isWindowVisible, lists, setLoading]);

  // fetch all lists every 10 minutes, but only after we initialize a library
  useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null);

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    if (loading) return;
    const promises: Promise<any>[] = [];
    setLoading(true);
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list.current && !list.loadingRequestId && !list.error) {
        promises.push(
          fetchList(listUrl).catch((error) =>
            console.debug("list added fetching error", error)
          )
        );
      }
    });

    Promise.all(promises).finally(() => setLoading(false));
  }, [loading, dispatch, fetchList, library, lists, setLoading]);

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    if (loading) return;
    const promises: Promise<any>[] = [];
    setLoading(true);
    Object.keys(SUPPORTED_LIST_URLS).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        promises.push(
          fetchList(listUrl).catch((error) =>
            console.debug("list added fetching error", error)
          )
        );
      }
    });

    Promise.all(promises).finally(() => setLoading(false));
  }, [loading, dispatch, fetchList, library, lists, setLoading]);

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(
          list.current.version,
          list.pendingUpdate.version
        );
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error("unexpected no version bump");
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
            const min = minVersionBump(
              list.current.tokens,
              list.pendingUpdate.tokens
            );
            // automatically update minor/patch as long as bump matches the min update
            if (bump >= min) {
              dispatch(acceptListUpdate(listUrl));
            } else {
              console.error(
                `List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`
              );
            }
            break;

          // update any active or inactive lists
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl));
        }
      }
    });
  }, [dispatch, lists, activeListUrls]);

  return null;
}
