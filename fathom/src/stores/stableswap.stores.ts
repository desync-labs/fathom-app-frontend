import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IStableSwapService from "../services/interfaces/IStableSwapService";

export default class StableSwapStore {

    service:IStableSwapService;
    rootStore: RootStore;
  
    constructor(rootStore:RootStore, service: IStableSwapService) { 
      makeAutoObservable(this);
      this.service = service;
      this.rootStore  = rootStore;
    }
  
    swapToken = async (index:number, address:string, token:number) =>{
        switch(index) { 
            case 0: {
               try{
                  console.log(`swapTokenToStablecoin for address : ${address} token: ${token}`) 
                  await this.service.swapTokenToStablecoin(address,token)
                  this.rootStore.alertStore.setShowSuccessAlert(true,'USDT token swapped with FXD!')
               }catch(error){
                  this.rootStore.alertStore.setShowErrorAlert(true)
               } 
               break; 
            } 
            case 1: { 
               try{
                  console.log(`swapStablecoinToToken for address : ${address} token: ${token}`) 
                  await this.service.swapStablecoinToToken(address,token)
                  this.rootStore.alertStore.setShowSuccessAlert(true,'FXD token swapped with USDT!')
               }catch(error){
                  this.rootStore.alertStore.setShowErrorAlert(true)
               } 
               break; 
            } 
            default: { 
               console.log("Invalid option from stableswap module.") 
               break; 
            } 
         } 
    }
  }