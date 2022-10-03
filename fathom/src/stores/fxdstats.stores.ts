// src/stores/user.store.js

import BigNumber from "bignumber.js";
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import { Constants } from "../helpers/Constants";
import IFXDProtocolStatsService from "../services/interfaces/IFXDProtocolStatsService";
import IFXDProtocolStats from "./interfaces/IFXDProtocolStats";

export default class FXDProtocolStatsStore {

protocolStats:IFXDProtocolStats;
service:IFXDProtocolStatsService;

  constructor(rootStore:RootStore, service: IFXDProtocolStatsService) { 
    makeAutoObservable(this);
    this.service = service;
    this.protocolStats = { fathomSupplyCap : new BigNumber(0),
                           totalValueLocked: new BigNumber(0),
                           fxdPriceFromDex: new BigNumber(0),
                           liquidationRatio: new BigNumber(0),
                           closeFactor: new BigNumber(0)
                        }
  }

  setProtocolStats = (_stats:IFXDProtocolStats) => {
    this.protocolStats = _stats;
  };

  fetchProtocolStats = async () =>{
    let stats = await this.service.fetchProtocolStats();
    runInAction(() =>{
      this.setProtocolStats(stats)
    })
  }

  getFormattedLiquidationRatio = () =>{
    return new BigNumber(this.protocolStats.liquidationRatio).div(Constants.WeiPerRay).toString();
  }

  getFormattedFXDPriceRatio = () =>{
    return new BigNumber(this.protocolStats.fxdPriceFromDex).div(Constants.WeiPerWad).toString();
  }

  getFormattedTVL = () =>{
    let number =  BigNumber(this.protocolStats.totalValueLocked).div(Constants.WeiPerWad);
    let formattedNumber =  this.commarize(number)
    return `$ ${formattedNumber}`;
  }

  commarize = (number:BigNumber) =>{
    let min = 1e3;
    if (number.toNumber() >= min) {
        var units = ["k", "M", "B", "T"];

        var order = Math.floor(Math.log(number.toNumber()) / Math.log(1000));

        var unitname = units[(order - 1)];
        var num = Math.floor(number.toNumber() / 1000 ** order);

        // output number remainder + unitname
        return num + unitname
    }
    return number.toLocaleString()
  }

}