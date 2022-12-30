import Xdc3 from "xdc3";
import { AbiItem } from "web3-utils";
import { AbiItem as XdcAbiItem } from "xdc3-utils";
import { XDC_CHAIN_IDS } from "connectors/networks";

interface ContractMetaData {
  address: string;
  abi: AbiItem[];
}

interface XdcContractMetaData {
  address: string;
  abi: XdcAbiItem[];
}

export class Web3Utils {
  public static xdc3: Xdc3;
  /**
   * We need to avoid create new instance of contract each time
   */
  public static contracts = new Map();
  public static provider: any;

  public static getContractInstance(
    contractMetaData: ContractMetaData | XdcContractMetaData,
    chainId: number
  ): any {
    /**
     * Get cache key by address and chainId
     */
    const contractKey = `${chainId}:${contractMetaData.address}`;
    /**
     * Check this key in Map, if it has return cached instance
     */
    if (Web3Utils.contracts.has(contractKey)) {
      return Web3Utils.contracts.get(contractKey);
    }
    /**
     * If we have no this contract, need to create instance and cache it
     * We already has Web3 instance so need to create contract instance and cache it
     */
    if (Web3Utils.xdc3 instanceof Xdc3) {
      const contract = new Web3Utils.xdc3.eth.Contract(
        contractMetaData.abi as XdcContractMetaData["abi"],
        contractMetaData.address
      );

      Web3Utils.contracts.set(contractKey, contract);
      return contract;
    }
    /**
     * We have no Web3 instance need to create new instance of Web3
     */
    Web3Utils.xdc3 = new Xdc3(
      Web3Utils.provider || Web3Utils.getWeb3ProviderUrl(chainId)
    );

    const contract = new Web3Utils.xdc3.eth.Contract(
      contractMetaData.abi as XdcContractMetaData["abi"],
      contractMetaData.address
    );

    Web3Utils.contracts.set(contractKey, contract);

    return contract;
  }

  public static getContractInstanceFrom(
    abi: AbiItem[] | XdcAbiItem[],
    address: string,
    chainId: number
  ): any {
    const contractKey = `${chainId}:${address}`;

    if (Web3Utils.contracts.has(contractKey)) {
      return Web3Utils.contracts.get(contractKey);
    }

    if (Web3Utils.xdc3 instanceof Xdc3) {
      const contract = new Web3Utils.xdc3.eth.Contract(
        abi as XdcAbiItem[],
        address
      );
      Web3Utils.contracts.set(contractKey, contract);
      return contract;
    }

    Web3Utils.xdc3 = new Xdc3(
      Web3Utils.provider || Web3Utils.getWeb3ProviderUrl(chainId)
    );

    const contract = new Web3Utils.xdc3.eth.Contract(abi as XdcAbiItem[], address);

    Web3Utils.contracts.set(contractKey, contract);

    return contract;
  }

  public static getWeb3Instance(chainId: number): any {
    if (XDC_CHAIN_IDS.includes(chainId) && Web3Utils.xdc3 instanceof Xdc3) {
      return Web3Utils.xdc3;
    }

    Web3Utils.xdc3 = new Xdc3(
      Web3Utils.provider || Web3Utils.getWeb3ProviderUrl(chainId)
    );
    return Web3Utils.xdc3;
  }

  public static getWeb3ProviderUrl: any = (chainId: number) => {
    let web3ProviderUrl = "";
    switch (chainId) {
      case 1337:
        web3ProviderUrl = "ws://localhost:8545";
        break;
      case 50:
        web3ProviderUrl = "";
        break;
      case 51:
        web3ProviderUrl = "https://rpc.apothem.network";
        break;
    }

    return web3ProviderUrl;
  };
}
