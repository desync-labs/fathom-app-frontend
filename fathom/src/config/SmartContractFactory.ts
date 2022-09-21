import { AbiItem } from 'web3-utils'
import CollateralPoolConfigAbi from './ABI/CollateralPoolConfig.json'
import ProxyWalletRegistryAbi from './ABI/ProxyWalletRegistry.json'
import ProxyWalletAbi from './ABI/ProxyWallet.json'
import FathomStablecoinProxyActionAbi from './ABI/FathomStablecoinProxyActions.json'
import BEP20Abi from './ABI/BEP20.json'
import GetPositionsAbi from './ABI/GetPositions.json'
import StableSwapModule from './ABI/StableSwapModule.json'
import Addresses from './addresses.json'

export class SmartContractFactory{

    public static Addresses(){
        try{
            let env = process.env.REACT_APP_ENV || 'dev';
            let address:any;
            switch(env){
                case 'dev':
                    address = Addresses.dev;
                    break;
                case 'staging':
                    address = Addresses.staging;
                    break;
                case 'prod':
                    address = Addresses.prod;
                    break;
                default:
                    address = Addresses.dev;
                    break;
            }
            return address;
        }catch(e){
            console.error(`Error in fetching address`)
            return {}
        }
    }

    public static PoolConfig  = {
        abi:CollateralPoolConfigAbi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().collateralPoolConfig
    }

    public static ProxyWalletRegistry  = {
        abi:ProxyWalletRegistryAbi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().proxyWalletRegistry
    }

    public static proxyWallet  = {
        abi:ProxyWalletAbi.abi as AbiItem [],
        address:''
    }

    public static FathomStablecoinProxyAction  = {
        abi:FathomStablecoinProxyActionAbi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().fathomStablecoinProxyActions 
    }

    public static WXDC  = {
        abi:BEP20Abi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().WXDC
    }

    public static USDT  = {
        abi:BEP20Abi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().USDT
    }

    public static BEP20  = (_address:string) =>{
        return{
            abi:BEP20Abi.abi as AbiItem [],
            address:_address
        }
    }

    public static FathomStableCoin  = {
        abi:BEP20Abi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().fathomStablecoin
    }

    public static PositionManager  = {
        abi:[],
        address:SmartContractFactory.Addresses().positionManager
    }

    public static StabilityFeeCollector  = {
        abi:[],
        address:SmartContractFactory.Addresses().stabilityFeeCollector
    }

    public static WXDCCollateralTokenAdapter  = {
        abi:[],
        address:SmartContractFactory.Addresses().collateralTokenAdapter
    }

    public static USDTCollateralTokenAdapter  = {
        abi:[],
        address:SmartContractFactory.Addresses().collateralTokenAdapterUSDT
    }

    public static StablecoinAdapter  = {
        abi:[],
        address:SmartContractFactory.Addresses().stablecoinAdapter
    }

    public static AuthtokenAdapter  = {
        abi:[],
        address:SmartContractFactory.Addresses().authTokenAdapter
    }

    public static FathomStablecoinProxyActions  = {
        abi:[],
        address:SmartContractFactory.Addresses().fathomStablecoinProxyActions
    }

    public static GetPositions  = {
        abi:GetPositionsAbi.abi as AbiItem [],
        address:SmartContractFactory.Addresses().getPositions
    }

    public static StableSwapModule  = {
        abi:StableSwapModule.abi as AbiItem [],
        address:SmartContractFactory.Addresses().stableSwapModule
    }
}