import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStableSwapService from "../services/interfaces/IStableSwapService";

export default class StableSwapStore {

    service:IStableSwapService;
  
    constructor(rootStore:RootStore, service: IStableSwapService) { 
      makeAutoObservable(this);
      this.service = service;
    }
  
    swapToken = async (index:number, address:string, token:number) =>{
        switch(index) { 
            case 0: { 
                this.service.swapTokenToStablecoin(address,token)
               break; 
            } 
            case 1: { 
               await this.service.swapStablecoinToToken(address,token)
               break; 
            } 
            default: { 
               console.log("Invalid option from stableswap module.") 
               break; 
            } 
         } 
    }
  }