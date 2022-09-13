// src/stores/index.js

import React from "react";
import PoolService from "../services/PoolService";
import AuthStore from "./auth.store";
import PoolStore from "./pool.store";

export class RootStore {
  poolStore: PoolStore;
  authStore: AuthStore;
  
  constructor() {
    this.authStore = new AuthStore(this)
    this.poolStore = new PoolStore(this,new PoolService())
  }
}

const StoresContext = React.createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => React.useContext(StoresContext);
