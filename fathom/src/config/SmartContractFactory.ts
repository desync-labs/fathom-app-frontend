// interface DeployedContract{
//     address:string,
//     abi: string
// }

import { AbiItem } from 'web3-utils'
import CollateralPoolConfigAbi from './ABI/CollateralPoolConfig.json'
import ProxyWalletRegistryAbi from './ABI/ProxyWalletRegistry.json'
import ProxyWalletAbi from './ABI/ProxyWallet.json'
import FathomStablecoinProxyActionAbi from './ABI/FathomStablecoinProxyActions.json'
import BEP20Abi from './ABI/BEP20.json'



export class SmartContractFactory{

    public static PoolConfig  = {
        abi:CollateralPoolConfigAbi.abi as AbiItem [],
        address:'0x8aEE29EaA4CE75FA53A7F63EEDA722aADaa21DC9'
    }

    public static ProxyWalletRegistry  = {
        abi:ProxyWalletRegistryAbi.abi as AbiItem [],
        address:'0x79A63218AA430D9587De5Ccc8484D6cFd61DC02e'
    }

    public static proxyWallet  = {
        abi:ProxyWalletAbi.abi as AbiItem [],
        address:''
    }

    public static FathomStablecoinProxyAction  = {
        abi:FathomStablecoinProxyActionAbi.abi as AbiItem [],
        address:'0x8598b178d5e6C40Cb5800De5522184092469b40C'
    }

    public static WXDC  = {
        abi:BEP20Abi.abi as AbiItem [],
        address:'0xc36b26cf999F9f4A085Ce5bD1A541a4B81a70753'
    }


}