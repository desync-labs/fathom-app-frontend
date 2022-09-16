import { AbiItem } from 'web3-utils'
import CollateralPoolConfigAbi from './ABI/CollateralPoolConfig.json'
import ProxyWalletRegistryAbi from './ABI/ProxyWalletRegistry.json'
import ProxyWalletAbi from './ABI/ProxyWallet.json'
import FathomStablecoinProxyActionAbi from './ABI/FathomStablecoinProxyActions.json'
import BEP20Abi from './ABI/BEP20.json'
import GetPositionsAbi from './ABI/GetPositions.json'



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

    public static PositionManager  = {
        abi:[],
        address:'0xADd9227440f4BB447142b6df006016EA7c0773ba'
    }

    public static StabilityFeeCollector  = {
        abi:[],
        address:'0x0Cdd5Ba91fe821BCa30f901E5805dcDc2d5c2Aa4'
    }

    public static CollateralTokenAdapter  = {
        abi:[],
        address:'0x1A3f51fAA7d76eB482FFC22aec67152A46E0f1dd'
    }

    public static StablecoinAdapter  = {
        abi:[],
        address:'0xfA104bC5010410a03d2846c04373093Ca709c4C6'
    }

    public static FathomStablecoinProxyActions  = {
        abi:[],
        address:'0x8598b178d5e6C40Cb5800De5522184092469b40C'
    }

    public static GetPositions  = {
        abi:GetPositionsAbi.abi as AbiItem [],
        address:'0x60D00c5CEB25ee50b13B33B2dd52A2F0E3036951'
    }

}