import IFXDProtocolStats from "../../stores/interfaces/IFXDProtocolStats";

export default interface IFXDProtocolStatsService{
    fetchProtocolStats(): Promise<IFXDProtocolStats>;
}
