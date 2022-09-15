import { SmartContractFactory } from "../config/SmartContractFactory";
import IPositionService from "./interfaces/IPositionService";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";


export default class PositionService implements IPositionService{

    async openPosition(address:string, poolId:string): Promise<void>{
        let proxyWalletaddress = await this.proxyWalletExist(address);

        if(proxyWalletaddress === Constants.ZERO_ADDRESS){
            console.log('Proxy wallet not exist...')
            proxyWalletaddress = await this.createProxyWallet(address)
        }

        console.log(`Open position for proxy wallet ${proxyWalletaddress}...`)

        const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi,proxyWalletaddress)
        const encodedResult = Web3Utils.getWeb3Instance().eth.abi.encodeParameters(["address"], [address]);

        let jsonInterface =  SmartContractFactory.FathomStablecoinProxyAction.abi.filter((abi) => abi.name === 'openLockTokenAndDraw')[0]  

        let openPositionCall =  Web3Utils.getWeb3Instance().eth.abi.encodeFunctionCall(jsonInterface, [
            SmartContractFactory.PositionManager.address,
            SmartContractFactory.StabilityFeeCollector.address,
            SmartContractFactory.CollateralTokenAdapter.address,
            SmartContractFactory.StablecoinAdapter.address,
            poolId,
            Constants.WeiPerWad.multipliedBy(200).toString(),
            Constants.WeiPerWad.multipliedBy(90).toString(),
            '1',
            encodedResult,
          ]);

          const WXDC = Web3Utils.getContractInstance(SmartContractFactory.WXDC)
          await WXDC.methods.approve(proxyWalletaddress, Constants.WeiPerWad.multipliedBy(10000)).send({from:address});
          await wallet.methods.execute2(SmartContractFactory.FathomStablecoinProxyActions.address, openPositionCall).send({from:address});
    }

    //Create a proxy wallet for a user
    async createProxyWallet(address:string): Promise<string>{
        try{
            console.log('Crteating a proxy wallet...')
            let proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry)
            await proxyWalletRegistry.methods.build(address).send({from:address});
            let proxyWallet = await proxyWalletRegistry.methods.proxies(address).call();
            return proxyWallet;
        }catch(error){
            console.error(`Error in createProxyWallet: ${error}`)
            return Constants.ZERO_ADDRESS;
        }
    }

    //Check if proxy wallet for a user
    async proxyWalletExist(address:string): Promise<string>{
        try{
            console.log('Check if proxy wallet exist.')
            let proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry)
            let proxyWallet = await proxyWalletRegistry.methods.proxies(address).call();
            return proxyWallet;
        }catch(error){
            console.error(`Error in proxyWalletExist: ${error}`)
            return Constants.ZERO_ADDRESS;
        }
    }


}