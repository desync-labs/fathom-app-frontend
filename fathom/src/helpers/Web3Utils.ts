import Web3 from "web3";
import { AbiItem } from "web3-utils";

interface ContractMetaData {
  address: string;
  abi: AbiItem[];
}

export class Web3Utils {
  public static web3: Web3;
  /**
   * We need to avoid create new instance of contract each time
   */
  public static contracts = new Map();

  public static getContractInstance: any = (
    contractMetaData: ContractMetaData
  ) => {
    /**
     * Get cache key by address
     */
    const contractKey = contractMetaData.address;
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
    if (Web3Utils.web3 instanceof Web3) {
      const contract = new Web3Utils.web3.eth.Contract(
        contractMetaData.abi,
        contractMetaData.address
      );
      Web3Utils.contracts.set(contractKey, contract);
      return contract;
    }
    /**
     * We have no Web3 instance need to create new instance of Web3
     */
    Web3Utils.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER_URL
    );

    const contract = new Web3Utils.web3.eth.Contract(
      contractMetaData.abi,
      contractMetaData.address
    );

    Web3Utils.contracts.set(contractKey, contract);

    return contract;
  };

  public static getContractInstanceFrom: any = (
    abi: AbiItem[],
    address: string
  ) => {
    const contractKey = address;

    if (Web3Utils.contracts.has(contractKey)) {
      return Web3Utils.contracts.get(contractKey);
    }

    if (Web3Utils.web3 instanceof Web3) {
      const contract = new Web3Utils.web3.eth.Contract(
        abi,
        address
      );
      Web3Utils.contracts.set(contractKey, contract);
      return contract;
    }

    Web3Utils.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER_URL
    );

    const contract = new Web3Utils.web3.eth.Contract(
      abi,
      address
    );

    Web3Utils.contracts.set(contractKey, contract);
    return contract;
  };

  public static getWeb3Instance: any = () => {
    if (Web3Utils.web3 instanceof Web3) {
      return Web3Utils.web3;
    }

    Web3Utils.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_WEB3_PROVIDER_URL
    );
    return Web3Utils.web3;
  };
}
