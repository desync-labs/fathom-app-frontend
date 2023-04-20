import Xdc3 from "xdc3";
import { AbiItem } from "web3-utils";
import { AbiItem as XdcAbiItem } from "xdc3-utils";

interface ContractMetaData {
  address: string;
  abi: AbiItem[];
}

interface XdcContractMetaData {
  address: string;
  abi: XdcAbiItem[];
}

export class Web3Utils {
  public static getContractInstance(
    contractMetaData: ContractMetaData | XdcContractMetaData,
    library: Xdc3
  ): any {
    return new library.eth.Contract(
      contractMetaData.abi as XdcContractMetaData["abi"],
      contractMetaData.address
    );
  }

  public static getContractInstanceFrom(
    abi: AbiItem[] | XdcAbiItem[],
    address: string,
    library: Xdc3
  ): any {
    return new library.eth.Contract(abi as XdcAbiItem[], address);
  }
}
