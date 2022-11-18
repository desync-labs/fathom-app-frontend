import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { Constants } from "helpers/Constants";
import IFXDProtocolStatsService from "services/interfaces/IFXDProtocolStatsService";
import IFXDProtocolStats from "stores/interfaces/IFXDProtocolStats";

export const defaultProtocolStats = {
  fathomSupplyCap: new BigNumber(0),
  totalValueLocked: new BigNumber(0),
  fxdPriceFromDex: new BigNumber(0),
  liquidationRatio: new BigNumber(0),
  closeFactor: new BigNumber(0),
}

export default class FXDProtocolStatsStore {
  protocolStats: IFXDProtocolStats;
  service: IFXDProtocolStatsService;
  formatter: Intl.NumberFormat;

  constructor(rootStore: RootStore, service: IFXDProtocolStatsService) {
    makeAutoObservable(this);
    this.service = service;
    this.protocolStats = defaultProtocolStats;
    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  setProtocolStats(_stats: IFXDProtocolStats) {
    this.protocolStats = _stats;
  }

  setDefaultStats() {
    this.protocolStats = defaultProtocolStats;
  }

  async fetchProtocolStats() {
    const stats = await this.service.fetchProtocolStats();
    this.setProtocolStats(stats);
  }

  getFormattedFXDPriceRatio = () => {
    const number = new BigNumber(this.protocolStats.fxdPriceFromDex).div(
      Constants.WeiPerWad
    );
    return `$ ${number.toFormat(2)}`;
  };

  getFormattedTVL() {
    const number = BigNumber(this.protocolStats.totalValueLocked).div(
      Constants.WeiPerWad
    );
    return this.formatter.format(number.toNumber());
  }

  getFormattedSupply() {
    const number = this.protocolStats.fathomSupplyCap.toNumber();
    return this.formatter
      .formatToParts(number)
      .map((p) =>
        p.type !== "literal" && p.type !== "currency" ? p.value : ""
      )
      .join("");
  }
}
