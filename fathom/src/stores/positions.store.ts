import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import IPositionService from "../services/interfaces/IPositionService";

export default class PositionStore {

    service:IPositionService;
    
    constructor(rootStore:RootStore, service: IPositionService) { 
        makeAutoObservable(this);
        this.service = service;
    }

    openPosition = async () =>{
        await this.service.openPosition();
      }
}