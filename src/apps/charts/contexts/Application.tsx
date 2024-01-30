import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
  ReactNode,
  FC,
  useMemo,
} from "react";
import { timeframeOptions, SUPPORTED_LIST_URLS } from "apps/charts/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import getTokenList from "apps/charts/utils/tokenLists";
import { healthClient } from "apollo/client";
import { SUBGRAPH_HEALTH } from "apps/charts/apollo/queries";
dayjs.extend(utc);

const UPDATE = "UPDATE";
const UPDATE_TIMEFRAME = "UPDATE_TIMEFRAME";
const UPDATE_SESSION_START = "UPDATE_SESSION_START";
const UPDATED_SUPPORTED_TOKENS = "UPDATED_SUPPORTED_TOKENS";
const UPDATE_LATEST_BLOCK = "UPDATE_LATEST_BLOCK";
const UPDATE_HEAD_BLOCK = "UPDATE_HEAD_BLOCK";

const SUPPORTED_TOKENS = "SUPPORTED_TOKENS";
const TIME_KEY = "TIME_KEY";
const CURRENCY = "CURRENCY";
const SESSION_START = "SESSION_START";
const LATEST_BLOCK = "LATEST_BLOCK";
const HEAD_BLOCK = "HEAD_BLOCK";

type State = {
  [CURRENCY]?: string;
  [TIME_KEY]?: string;
  [SUPPORTED_TOKENS]?: Record<string, any>;
  [SESSION_START]?: string;
  [LATEST_BLOCK]?: string;
  [HEAD_BLOCK]?: string;
};

const ApplicationContext = createContext({} as [State, any]);

const useApplicationContext = () => useContext(ApplicationContext);

function reducer(
  state: State,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case UPDATE: {
      const { currency } = payload;
      return {
        ...state,
        [CURRENCY]: currency,
      };
    }
    case UPDATE_TIMEFRAME: {
      const { newTimeFrame } = payload;
      return {
        ...state,
        [TIME_KEY]: newTimeFrame,
      };
    }
    case UPDATE_SESSION_START: {
      const { timestamp } = payload;
      return {
        ...state,
        [SESSION_START]: timestamp,
      };
    }

    case UPDATE_LATEST_BLOCK: {
      const { block } = payload;
      return {
        ...state,
        [LATEST_BLOCK]: block,
      };
    }

    case UPDATE_HEAD_BLOCK: {
      const { block } = payload;
      return {
        ...state,
        [HEAD_BLOCK]: block,
      };
    }

    case UPDATED_SUPPORTED_TOKENS: {
      const { supportedTokens } = payload;
      return {
        ...state,
        [SUPPORTED_TOKENS]: supportedTokens,
      };
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

const INITIAL_STATE = {
  CURRENCY: "USD",
  TIME_KEY: timeframeOptions.ALL_TIME,
};

export type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const update = useCallback((currency: string) => {
    dispatch({
      type: UPDATE,
      payload: {
        currency,
      },
    });
  }, []);

  // global time window for charts - see timeframe options in constants
  const updateTimeframe = useCallback((newTimeFrame: string) => {
    dispatch({
      type: UPDATE_TIMEFRAME,
      payload: {
        newTimeFrame,
      },
    });
  }, []);

  // used for refresh button
  const updateSessionStart = useCallback((timestamp: string) => {
    dispatch({
      type: UPDATE_SESSION_START,
      payload: {
        timestamp,
      },
    });
  }, []);

  const updateSupportedTokens = useCallback((supportedTokens: any) => {
    dispatch({
      type: UPDATED_SUPPORTED_TOKENS,
      payload: {
        supportedTokens,
      },
    });
  }, []);

  const updateLatestBlock = useCallback((block: string) => {
    dispatch({
      type: UPDATE_LATEST_BLOCK,
      payload: {
        block,
      },
    });
  }, []);

  const updateHeadBlock = useCallback((block: string) => {
    dispatch({
      type: UPDATE_HEAD_BLOCK,
      payload: {
        block,
      },
    });
  }, []);

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateSessionStart,
            updateTimeframe,
            updateSupportedTokens,
            updateLatestBlock,
            updateHeadBlock,
          },
        ],
        [
          state,
          update,
          updateTimeframe,
          updateSessionStart,
          updateSupportedTokens,
          updateLatestBlock,
          updateHeadBlock,
        ]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export default Provider;

export function useLatestBlocks() {
  const [state, { updateLatestBlock, updateHeadBlock }] =
    useApplicationContext();

  const latestBlock = state?.[LATEST_BLOCK];
  const headBlock = state?.[HEAD_BLOCK];

  useEffect(() => {
    async function fetch() {
      healthClient
        .query({
          query: SUBGRAPH_HEALTH,
        })
        .then((res: any) => {
          const syncedBlock =
            res.data.indexingStatusForCurrentVersion.chains[0].latestBlock
              .number;
          const headBlock =
            res.data.indexingStatusForCurrentVersion.chains[0].chainHeadBlock
              .number;
          if (syncedBlock && headBlock) {
            updateLatestBlock(syncedBlock);
            updateHeadBlock(headBlock);
          }
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
    if (!latestBlock) {
      fetch();
    }
  }, [latestBlock, updateHeadBlock, updateLatestBlock]);

  return [latestBlock, headBlock];
}

type UseCurrentCurrencyReturnType = [any, () => void];

export const useCurrentCurrency = (): UseCurrentCurrencyReturnType => {
  const [state, { update }] = useApplicationContext();
  const toggleCurrency = useCallback(() => {
    if (state[CURRENCY] === "ETH") {
      update("USD");
    } else {
      update("ETH");
    }
  }, [state, update]);
  return [state[CURRENCY], toggleCurrency];
};

export function useTimeframe() {
  const [state, { updateTimeframe }] = useApplicationContext();
  const activeTimeframe = state?.[`TIME_KEY`];
  return [activeTimeframe, updateTimeframe];
}

export function useStartTimestamp() {
  const [activeWindow] = useTimeframe();
  const [startDateTimestamp, setStartDateTimestamp] = useState<number>();

  // monitor the old date fetched
  useEffect(() => {
    const startTime =
      dayjs
        .utc()
        .subtract(
          1,
          activeWindow === timeframeOptions.WEEK
            ? "week"
            : activeWindow === timeframeOptions.ALL_TIME
            ? "year"
            : "year"
        )
        .startOf("day")
        .unix() - 1;
    // if we find a new start time less than the current startrtime - update oldest pooint to fetch
    setStartDateTimestamp(startTime);
  }, [activeWindow, startDateTimestamp]);

  return startDateTimestamp;
}

export function useListedTokens() {
  const [state, { updateSupportedTokens }] = useApplicationContext();
  const supportedTokens = state?.[SUPPORTED_TOKENS];

  useEffect(() => {
    async function fetchList() {
      const allFetched = await SUPPORTED_LIST_URLS.reduce(
        async (fetchedTokens: Promise<any>, url: string) => {
          const tokensSoFar = await fetchedTokens;
          const newTokens = await getTokenList(url);
          if (newTokens?.tokens) {
            return Promise.resolve([...tokensSoFar, ...newTokens.tokens]);
          } else {
            return Promise.resolve([...tokensSoFar]);
          }
        },
        Promise.resolve([])
      );

      const formatted = allFetched?.map((t) => t.address.toLowerCase());
      updateSupportedTokens(formatted);
    }
    if (!supportedTokens) {
      try {
        fetchList();
      } catch {
        console.log("Error fetching");
      }
    }
  }, [updateSupportedTokens, supportedTokens]);

  return supportedTokens;
}
