import Xdc3 from "xdc3";
import { AbiItem as XdcAbiItem } from "xdc3-utils";
import { Contract } from "xdc3-eth-contract";
interface XdcContractMetaData {
  address: string;
  abi: XdcAbiItem[];
}

export class Web3Utils {
  static contracts = new Map<string, Contract>();
  public static getContractInstance(
    contractMetaData: XdcContractMetaData,
    library: Xdc3
  ): Contract {
    if (Web3Utils.contracts.has(contractMetaData.address)) {
      return Web3Utils.contracts.get(contractMetaData.address) as Contract;
    }

    const contract =  new library.eth.Contract(
      contractMetaData.abi as XdcContractMetaData["abi"],
      contractMetaData.address
    );

    Web3Utils.contracts.set(contractMetaData.address, contract);

    return contract;
  }

  public static getContractInstanceFrom(
    abi: XdcAbiItem[],
    address: string,
    library: Xdc3
  ): any {
    if (Web3Utils.contracts.has(address)) {
      return Web3Utils.contracts.get(address) as Contract;
    }

    const contract = new library.eth.Contract(abi as XdcAbiItem[], address);

    Web3Utils.contracts.set(address, contract);

    return contract;
  }
}
