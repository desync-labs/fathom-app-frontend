import Web3 from "web3";
import { AbiItem } from 'web3-utils'

interface ContractMetaData{
    address:string,
    abi: AbiItem []
}


export class Web3Utils{
    public static getContractInstance:any = (contractMetaData:ContractMetaData) =>{
        var web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER_URL);
        return new web3.eth.Contract(contractMetaData.abi, contractMetaData.address)
    }

    public static getContractInstanceFrom:any = (abi:AbiItem [], address:string) =>{
        var web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER_URL);
        return new web3.eth.Contract(abi, address)
    }

    public static getWeb3Instance:any = () =>{
        return new Web3(Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER_URL);
    }
}