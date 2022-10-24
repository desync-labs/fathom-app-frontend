import BigNumber from "bignumber.js";
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import { Constants } from "helpers/Constants";
import IFXDProtocolStatsService from "services/interfaces/IFXDProtocolStatsService";
import IFXDProtocolStats from "stores/interfaces/IFXDProtocolStats";

export default class FXDProtocolStatsStore {
  protocolStats: IFXDProtocolStats;
  service: IFXDProtocolStatsService;
  formatter: Intl.NumberFormat;

  constructor(rootStore: RootStore, service: IFXDProtocolStatsService) {
    makeAutoObservable(this);
    this.service = service;
    this.protocolStats = {
      fathomSupplyCap: new BigNumber(0),
      totalValueLocked: new BigNumber(0),
      fxdPriceFromDex: new BigNumber(0),
      liquidationRatio: new BigNumber(0),
      closeFactor: new BigNumber(0),
    };
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

  async fetchProtocolStats() {
    const stats = await this.service.fetchProtocolStats();
    runInAction(() => {
      this.setProtocolStats(stats);
    });
  }

  getFormattedLiquidationRatio() {
    return new BigNumber(this.protocolStats.liquidationRatio)
      .div(Constants.WeiPerRay)
      .toString();
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

  commarize(number: BigNumber) {
    let min = 1e3;
    if (number.toNumber() >= min) {
      var units = ["k", "M", "B", "T"];

      var order = Math.floor(Math.log(number.toNumber()) / Math.log(1000));

      var unitname = units[order - 1];
      var num = Math.floor(number.toNumber() / 1000 ** order);

      // output number remainder + unitname
      return num + unitname;
    }
    return number.toLocaleString();
  }
}
