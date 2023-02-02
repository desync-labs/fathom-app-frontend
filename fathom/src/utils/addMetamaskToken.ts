import { getTokenLogoURL } from "utils/tokenLogo";
import { SmartContractFactory } from "config/SmartContractFactory";
import AlertStore from "stores/alert.stores";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";
import { Strings } from "helpers/Strings";
import ActiveWeb3Transactions from "stores/transaction.store";

export const addMetamaskToken = async (
  chainId: number,
  alertStore: AlertStore,
  transactionStore: ActiveWeb3Transactions
) => {
  if (window.ethereum) {
    const tokenAdded = localStorage.getItem("tokenAdded");
    const address = SmartContractFactory.aXDCcTokenAddress(chainId);
    if (tokenAdded === address.toLowerCase()) {
      return;
    }
    const symbol = "aXDCc";
    const decimals = 18;
    const image = getTokenLogoURL("WXDC");
    try {
      // @ts-ignore
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address,
            symbol,
            decimals,
            image,
          },
        },
      });
      // @ts-ignore
      if (wasAdded) {
        localStorage.setItem("tokenAdded", address.toLowerCase());
        alertStore.setShowSuccessAlert(true, "Token aXDCc was added");
      } else {
        alertStore.setShowErrorAlert(
          true,
          "You did`n add token to your wallet"
        );
      }
    } catch (e: any) {
      alertStore.setShowErrorAlert(
        true,
        "Something wrong during add token process."
      );
    }
  } else {
    transactionStore.addTransaction({
      hash: SmartContractFactory.aXDCcTokenAddress(chainId).address,
      type: TransactionType.Token,
      active: false,
      status: TransactionStatus.None,
      title: "You received aXDCc token.",
      message: Strings.CheckTokenOnBlockExplorer,
    });
  }
};
