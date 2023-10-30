import IFXDProtocolStats from "services/interfaces/IFXDProtocolStats";

export default interface IFXDProtocolStatsService{
    fetchProtocolStats(): Promise<IFXDProtocolStats>;
}
