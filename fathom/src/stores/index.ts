// src/stores/index.js

import React from "react";
import PoolService from "../services/PoolService";
import PositionService from "../services/PositionService";
import StableSwapService from "../services/StableSwapService";
import AuthStore from "./auth.store";
import PoolStore from "./pool.store";
import PositionStore from "./positions.store";
import StableSwapStore from "./stableswap.stores";

export class RootStore {
  poolStore: PoolStore;
  authStore: AuthStore;
  positionStore: PositionStore;
  stableSwapStore: StableSwapStore;
  
  constructor() {
    this.authStore = new AuthStore(this)
    this.poolStore = new PoolStore(this,new PoolService())
    this.positionStore = new PositionStore(this, new PositionService())
    this.stableSwapStore = new StableSwapStore(this, new StableSwapService())
  }

}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);
