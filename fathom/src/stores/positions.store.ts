import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IPositionService from "../services/interfaces/IPositionService";
import IOpenPosition from "./interfaces/IOpenPosition";

export default class PositionStore {

    positions:IOpenPosition[] = [];
    service:IPositionService;
    
    constructor(rootStore:RootStore, service: IPositionService) { 
        makeAutoObservable(this);
        this.service = service;
    }

    openPosition = async (address:string, poolId:string,collatral:number,fathomToken:number) =>{
        console.log(`Open position clicked for address ${address}, poolId: ${poolId}, collatral:${collatral}, fathomToken: ${fathomToken}`)
        await this.service.openPosition(address,poolId,collatral,fathomToken);
    }

    closePosition = async (positionId:string,address:string, fathomToken:number) =>{
        console.log(`Close position clicked for address ${address}, positionId: ${positionId}, fathomToken: ${fathomToken}`)
        await this.service.closePosition(positionId,address,fathomToken)
    }

    fetchPositions = async (address:string) =>{
        let positions = await this.service.getPositionsWithSafetyBuffer(address);
        runInAction(() =>{
          this.setPositions(positions)
        })
    }

    setPositions = (_positions:IOpenPosition[]) => {
        this.positions = _positions;
    };
    
}