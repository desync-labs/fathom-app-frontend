import Xdc3 from "xdc3";
import { TransactionReceipt } from "xdc3-eth";
import BigNumber from "bignumber.js";

import { SmartContractFactory } from "config/SmartContractFactory";

import ActiveWeb3Transactions from "stores/transaction.store";
import AlertStore from "stores/alert.stores";
import {
  TransactionStatus,
  TransactionType
} from "stores/interfaces/ITransaction";
import IStakingService from "services/interfaces/IStakingService";

import { getEstimateGas } from "utils/getEstimateGas";

import {
  MAX_UINT256,
  DEFAULT_CHAIN_ID
} from "helpers/Constants";
import { Strings } from "helpers/Strings";
import { Web3Utils } from "helpers/Web3Utils";
import { SKIP_ERRORS } from "../connectors/networks";

export const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  chainId = DEFAULT_CHAIN_ID;

  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;

  constructor(
    alertStore: AlertStore,
    transactionStore: ActiveWeb3Transactions
  ) {
    this.alertStore = alertStore;
    this.transactionStore = transactionStore;
  }

  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          library
        );
        const MESSAGE = "Lock position created successfully!";
        const endTime = unlockPeriod * DAY_SECONDS;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          "createLock",
          [this.toWei(stakePosition, library), endTime],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        Staking.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .createLock(this.toWei(stakePosition, library), endTime)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Creating Lock",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          library
        );
        const MESSAGE = "Position unlock was successful!";

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          "unlockPartially",
          [lockId, this.toWei(amount, library)],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        Staking.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .unlockPartially(lockId, this.toWei(amount, library))
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Unlock",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          library
        );
        const MESSAGE = "Handling Early Unlock";

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          "earlyUnlock",
          [lockId],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        Staking.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return Staking.methods
          .earlyUnlock(lockId)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Early Unlock",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: any) => {
            reject(e);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  handleClaimRewards(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          library
        );
        const MESSAGE = "Claim Rewards was successful!";

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          "claimAllLockRewardsForStream",
          [streamId],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        Staking.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .claimAllLockRewardsForStream(streamId)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Claim Rewards",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  handleWithdrawAll(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const Staking = Web3Utils.getContractInstance(
          SmartContractFactory.Staking(this.chainId),
          library
        );
        const MESSAGE = "Withdraw all was successful!";

        /**
         * For FTHM stream we is 0
         */
        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          Staking,
          "withdrawStream",
          [0],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        Staking.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .withdrawStream(0)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Withdraw Rewards",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  approveStakingFTHM(
    account: string,
    fthmTokenAddress: string,
    library: Xdc3
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const FTHMToken = Web3Utils.getContractInstance(
          SmartContractFactory.MainToken(fthmTokenAddress),
          library
        );
        const MESSAGE = "Token approval was successful";

        const StakingAddress = SmartContractFactory.Staking(
          this.chainId
        ).address;

        const options = { from: account, gas: 0 };
        const gas = await getEstimateGas(
          FTHMToken,
          "approve",
          [StakingAddress, MAX_UINT256],
          options
        );
        options.gas = gas;

        /**
         * Block for XDC Pay.
         */
        FTHMToken.events.allEvents(
          (eventData: any, transactionReceipt: TransactionReceipt) => {
            if (SKIP_ERRORS.includes(eventData?.code)) {
              return;
            }
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        FTHMToken.methods
          .approve(StakingAddress, MAX_UINT256)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.transactionStore.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Approving the Token",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertStore.setShowSuccessAlert(true, MESSAGE);
            resolve(receipt.blockNumber);
          });
      } catch (e: any) {
        this.alertStore.setShowErrorAlert(true, e.message);
        reject(e);
      }
    });
  }

  async approvalStatusStakingFTHM(
    address: string,
    stakingPosition: number,
    fthmTokenAddress: string,
    library: Xdc3
  ) {
    try {
      const FTHMToken = Web3Utils.getContractInstance(
        SmartContractFactory.MainToken(fthmTokenAddress),
        library
      );

      const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

      const allowance = await FTHMToken.methods
        .allowance(address, StakingAddress)
        .call();

      return BigNumber(allowance).isGreaterThanOrEqualTo(
        this.toWei(stakingPosition, library)
      );
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
    library: Xdc3
  ) {
    try {
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(this.chainId),
        library
      );
      return Staking.methods
        .getStreamClaimableAmountPerLock(streamId, account, lockId)
        .call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getStreamClaimableAmount(account: string, library: Xdc3) {
    try {
      const StakingGetter = Web3Utils.getContractInstance(
        SmartContractFactory.StakingGetter(this.chainId),
        library
      );
      return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getMinLockPeriod(library: Xdc3) {
    try {
      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(this.chainId),
        library
      );
      return Staking.methods.minLockPeriod().call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  getPairPrice(token0: string, token1: string, library: Xdc3) {
    try {
      const DexPriceOracle = Web3Utils.getContractInstance(
        SmartContractFactory.DexPriceOracle(this.chainId),
        library
      );
      return DexPriceOracle.methods.getPrice(token0, token1).call();
    } catch (e: any) {
      this.alertStore.setShowErrorAlert(true, e.message);
    }
  }

  toWei(balance: number, library: Xdc3): string {
    return library.utils.toWei(balance.toString(), "ether");
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
