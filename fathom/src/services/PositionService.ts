import { SmartContractFactory } from "../config/SmartContractFactory";
import IPositionService from "./interfaces/IPositionService";
import Web3 from "web3";
import { BigNumber } from "bignumber.js";

const WeiPerWad = new BigNumber('1000000000000000000')


export default class PositionService implements IPositionService{

    async openPosition(address:string): Promise<void>{
        let proxyWalletaddress = await this.proxyWalletExist(address);

        if(proxyWalletaddress.length === 0){
            console.log('Proxy wallet not exist...')
            proxyWalletaddress = await this.createProxyWallet(address)
        }

        console.log(`Open position for proxy wallet ${proxyWalletaddress}...`)

        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

        console.log('22')
        const wallet = new web3.eth.Contract(SmartContractFactory.proxyWallet.abi, proxyWalletaddress);
        const encodedResult = web3.eth.abi.encodeParameters(["address"], [address]);

        console.log('26')
        let jsonInterface =  SmartContractFactory.FathomStablecoinProxyAction.abi.filter((abi) => abi.name === 'openLockTokenAndDraw')[0]  

        console.log('29')
        let openPositionCall = web3.eth.abi.encodeFunctionCall(jsonInterface, [
            '0xADd9227440f4BB447142b6df006016EA7c0773ba',//positionManager.address,
            '0x0Cdd5Ba91fe821BCa30f901E5805dcDc2d5c2Aa4',//stabilityFeeCollector.address,
            '0x1A3f51fAA7d76eB482FFC22aec67152A46E0f1dd',//collateralTokenAdapter.address,
            '0xfA104bC5010410a03d2846c04373093Ca709c4C6',//stablecoinAdapter.address,
            '0x5553445400000000000000000000000000000000000000000000000000000000',//COLLATERAL_POOL_ID,
            WeiPerWad.multipliedBy(200).toString(),
            WeiPerWad.multipliedBy(90).toString(),
            '1',
            encodedResult,
          ]);

          console.log('42')
          const WXDC = new web3.eth.Contract(SmartContractFactory.WXDC.abi, SmartContractFactory.WXDC.address);
          await WXDC.methods.approve(proxyWalletaddress, WeiPerWad.multipliedBy(10000)).send({from:address});
          console.log('45')
          const positionId = await wallet.methods.execute2('0x8598b178d5e6C40Cb5800De5522184092469b40C', openPositionCall).send({from:address});
          console.log('47')
    }

    //Create a proxy wallet for a user
    async createProxyWallet(address:string): Promise<string>{
        console.log('Crteating a proxy wallet...')
        let proxyWalletRegistryMetaData = SmartContractFactory.ProxyWalletRegistry;
        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const proxyWalletRegistry = new web3.eth.Contract(proxyWalletRegistryMetaData.abi, proxyWalletRegistryMetaData.address);
        await proxyWalletRegistry.methods.build(address).send({from:address});
        let proxyWallet = await proxyWalletRegistry.methods.proxies(address).call();
        return proxyWallet;
    }

    //Check if proxy wallet for a user
    async proxyWalletExist(address:string): Promise<string>{
        console.log('Check if proxy wallet exist.')
        let proxyWalletRegistryMetaData = SmartContractFactory.ProxyWalletRegistry;
        var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const proxyWalletRegistry = new web3.eth.Contract(proxyWalletRegistryMetaData.abi, proxyWalletRegistryMetaData.address);
        let proxyWallet = await proxyWalletRegistry.methods.proxies(address).call();
        return proxyWallet;
    }


}