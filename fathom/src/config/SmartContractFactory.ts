// interface DeployedContract{
//     address:string,
//     abi: string
// }

import { AbiItem } from 'web3-utils'
import Abi from './ABI/CollateralPoolConfig.json'


export class SmartContractFactory{

    public static PoolConfig  = {
        abi:Abi.abi as AbiItem [],
        address:'0x8aEE29EaA4CE75FA53A7F63EEDA722aADaa21DC9'
    }


}