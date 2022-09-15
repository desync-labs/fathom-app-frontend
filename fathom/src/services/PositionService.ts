import IPositionService from "./interfaces/IPositionService";

export default class PoolService implements IPositionService{
    async openPosition(): Promise<void>{
        console.log('Opening a position...')

    }
}