import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
  FC,
} from "react";

const FATHOMSWAP = "FATHOMSWAP";

const VERSION = "VERSION";
const CURRENT_VERSION = 0;
const LAST_SAVED = "LAST_SAVED";
const DISMISSED_PATHS = "DISMISSED_PATHS";
const SAVED_ACCOUNTS = "SAVED_ACCOUNTS";
const SAVED_TOKENS = "SAVED_TOKENS";
const SAVED_PAIRS = "SAVED_PAIRS";

const UPDATABLE_KEYS = [
  DISMISSED_PATHS,
  SAVED_ACCOUNTS,
  SAVED_PAIRS,
  SAVED_TOKENS,
];

const UPDATE_KEY = "UPDATE_KEY";

type State = {
  [VERSION]: string;
  [DISMISSED_PATHS]: Record<string, any>;
  [SAVED_ACCOUNTS]: string[];
  [SAVED_TOKENS]: Record<string, any>;
  [SAVED_PAIRS]: Record<string, any>;
};

const LocalStorageContext = createContext({} as [State, any]);

const useLocalStorageContext = () => useContext(LocalStorageContext);

function reducer(
  state: State,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case UPDATE_KEY: {
      const { key, value } = payload;
      if (!UPDATABLE_KEYS.some((k) => k === key)) {
        throw Error(`Unexpected key in LocalStorageContext reducer: '${key}'.`);
      } else {
        return {
          ...state,
          [key]: value,
        };
      }
    }
    default: {
      throw Error(
        `Unexpected action type in LocalStorageContext reducer: '${type}'.`
      );
    }
  }
}

function init() {
  const defaultLocalStorage = {
    [VERSION]: CURRENT_VERSION,
    [DISMISSED_PATHS]: {},
    [SAVED_ACCOUNTS]: [],
    [SAVED_TOKENS]: {},
    [SAVED_PAIRS]: {},
  };

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(FATHOMSWAP) as string
    );
    if (parsed[VERSION] !== CURRENT_VERSION) {
      // this is where we could run migration logic
      return defaultLocalStorage;
    } else {
      return { ...defaultLocalStorage, ...parsed };
    }
  } catch {
    return defaultLocalStorage;
  }
}

type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  const updateKey = useCallback((key: string, value: any) => {
    dispatch({ type: UPDATE_KEY, payload: { key, value } });
  }, []);

  return (
    <LocalStorageContext.Provider
      value={useMemo(() => [state, { updateKey }], [state, updateKey])}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export default Provider;

export function Updater() {
  const [state] = useLocalStorageContext();

  useEffect(() => {
    window.localStorage.setItem(
      FATHOMSWAP,
      JSON.stringify({ ...state, [LAST_SAVED]: Math.floor(Date.now() / 1000) })
    );
  });

  return null;
}

export function usePathDismissed(path: string) {
  const [state, { updateKey }] = useLocalStorageContext();
  const pathDismissed = state?.[DISMISSED_PATHS]?.[path];
  function dismiss() {
    const newPaths = state?.[DISMISSED_PATHS];
    newPaths[path] = true;
    updateKey(DISMISSED_PATHS, newPaths);
  }

  return [pathDismissed, dismiss];
}

type UseSavedAccountReturnType = [
  string[],
  (account: string) => void,
  (account: string) => void
];

export function useSavedAccounts(): UseSavedAccountReturnType {
  const [state, { updateKey }] = useLocalStorageContext();
  const savedAccounts = state?.[SAVED_ACCOUNTS];

  const addAccount = useCallback(
    (account: string) => {
      updateKey(SAVED_ACCOUNTS, [...(savedAccounts ?? []), account]);
    },
    [savedAccounts, updateKey]
  );

  const removeAccount = useCallback(
    (account: string) => {
      const index = savedAccounts?.indexOf(account) ?? -1;
      if (index > -1) {
        updateKey(SAVED_ACCOUNTS, [
          ...savedAccounts.slice(0, index),
          ...savedAccounts.slice(index + 1, savedAccounts.length),
        ]);
      }
    },
    [savedAccounts, updateKey]
  );

  return [savedAccounts, addAccount, removeAccount];
}

type UseSavedPairsReturnType = [
  any,
  (
    address: string,
    token0Address: string,
    token1Address: string,
    token0Symbol: string,
    token1Symbol: string
  ) => void,
  (address: string) => void
];

export function useSavedPairs(): UseSavedPairsReturnType {
  const [state, { updateKey }] = useLocalStorageContext();
  const savedPairs = state?.[SAVED_PAIRS];

  function addPair(
    address: string,
    token0Address: string,
    token1Address: string,
    token0Symbol: string,
    token1Symbol: string
  ) {
    const newList = state?.[SAVED_PAIRS];
    newList[address] = {
      address,
      token0Address,
      token1Address,
      token0Symbol,
      token1Symbol,
    };
    updateKey(SAVED_PAIRS, newList);
  }

  function removePair(address: string) {
    const newList = state?.[SAVED_PAIRS];
    newList[address] = null;
    updateKey(SAVED_PAIRS, newList);
  }

  return [savedPairs, addPair, removePair];
}

type UseSavedTokensReturnType = [
  any,
  (address: string, symbol: string) => void,
  (address: string) => void
];

export function useSavedTokens(): UseSavedTokensReturnType {
  const [state, { updateKey }] = useLocalStorageContext();
  const savedTokens = state?.[SAVED_TOKENS];

  function addToken(address: string, symbol: string) {
    const newList = state?.[SAVED_TOKENS];
    newList[address] = {
      symbol,
    };
    updateKey(SAVED_TOKENS, newList);
  }

  function removeToken(address: string) {
    const newList = state?.[SAVED_TOKENS];
    newList[address] = null;
    updateKey(SAVED_TOKENS, newList);
  }

  return [savedTokens, addToken, removeToken];
}
