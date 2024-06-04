import { useCallback, useEffect, useState } from "react";
import { useActiveWeb3React } from "apps/dex/hooks";
import useDebounce from "apps/dex/hooks/useDebounce";
import useIsWindowVisible from "apps/dex/hooks/useIsWindowVisible";
import { updateBlockNumber } from "apps/dex/state/application/actions";
import { useDispatch } from "react-redux";
import { DISPLAY_DEX } from "connectors/networks";

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React();
  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    chainId,
    blockNumber: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== "number")
            return { chainId, blockNumber };
          return {
            chainId,
            blockNumber: Math.max(blockNumber, state.blockNumber),
          };
        }
        return state;
      });
    },
    [chainId, setState]
  );

  // attach/detach listeners
  useEffect(() => {
    if (
      !library ||
      !chainId ||
      !windowVisible ||
      !DISPLAY_DEX.includes(chainId)
    )
      return undefined;

    setState({ chainId, blockNumber: null });

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) =>
        console.error(
          `Failed to get block number for chainId: ${chainId}`,
          error
        )
      );

    library.on("block", blockNumberCallback);
    return () => {
      library.removeListener("block", blockNumberCallback);
    };
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (
      !debouncedState.chainId ||
      !debouncedState.blockNumber ||
      !windowVisible
    ) {
      return;
    }

    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      })
    );
  }, [
    windowVisible,
    dispatch,
    debouncedState.blockNumber,
    debouncedState.chainId,
  ]);

  return null;
}
