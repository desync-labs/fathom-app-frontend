import Xdc3 from "xdc3";
import { TransactionReceipt } from "xdc3-eth";
import BigNumber from "bignumber.js";

import { SmartContractFactory } from "config/SmartContractFactory";
import {
  TransactionStatus,
  TransactionType
} from "services/interfaces/models/ITransaction";
import IStakingService from "services/interfaces/services/IStakingService";

import { getEstimateGas } from "utils/getEstimateGas";

import {
  MAX_UINT256,
  DEFAULT_CHAIN_ID
} from "helpers/Constants";
import { Strings } from "helpers/Strings";
import { Web3Utils } from "helpers/Web3Utils";
import { SKIP_ERRORS } from "connectors/networks";

import {
  UseAlertAndTransactionServiceType
} from "context/alertAndTransaction";

export const DAY_SECONDS = 24 * 60 * 60;

export default class StakingService implements IStakingService {
  chainId = DEFAULT_CHAIN_ID;

  alertAndTransactionContext: UseAlertAndTransactionServiceType;
  constructor(alertAndTransactionContext: UseAlertAndTransactionServiceType) {
    this.alertAndTransactionContext = alertAndTransactionContext
  }

  createLock(
    account: string,
    stakePosition: number,
    unlockPeriod: number,
    library: Xdc3
  ): Promise<number | Error> {
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
          [library.utils.toWei(stakePosition.toString(), 'ether'), endTime],
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .createLock(library.utils.toWei(stakePosition.toString(), 'ether'), endTime)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Creating Lock",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
        reject(e);
      }
    });
  }

  handleUnlock(
    account: string,
    lockId: number,
    amount: number,
    library: Xdc3
  ): Promise<number | Error> {
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
          [lockId, library.utils.toWei(amount.toString(), 'ether')],
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .unlockPartially(lockId, library.utils.toWei(amount.toString(), 'ether'))
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Unlock",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
        reject(e);
      }
    });
  }

  handleEarlyWithdrawal(
    account: string,
    lockId: number,
    library: Xdc3
  ): Promise<number | Error> {
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        return Staking.methods
          .earlyUnlock(lockId)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Early Unlock",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e);
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .claimAllLockRewardsForStream(streamId)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Claim Rewards",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e)
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
        reject(e);
      }
    });
  }

  handleWithdrawAll(
    account: string,
    streamId: number,
    library: Xdc3
  ): Promise<number | Error> {
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        Staking.methods
          .withdrawStream(0)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Handling Withdraw Rewards",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e)
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
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
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(transactionReceipt.blockNumber);
          }
        );

        FTHMToken.methods
          .approve(StakingAddress, MAX_UINT256)
          .send(options)
          .on("transactionHash", (hash: any) => {
            this.alertAndTransactionContext.addTransaction({
              hash: hash,
              type: TransactionType.Approve,
              active: false,
              status: TransactionStatus.None,
              title: "Approving the Token",
              message: Strings.CheckOnBlockExplorer
            });
          })
          .then((receipt: TransactionReceipt) => {
            this.alertAndTransactionContext.setShowSuccessAlertHandler(true, MESSAGE);
            resolve(receipt.blockNumber);
          })
          .catch((e: Error) => {
            this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
            reject(e)
          });
      } catch (e: any) {
        this.alertAndTransactionContext.setShowErrorAlertHandler(true, e.message);
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
    const FTHMToken = Web3Utils.getContractInstance(
      SmartContractFactory.MainToken(fthmTokenAddress),
      library
    );

    const StakingAddress = SmartContractFactory.Staking(this.chainId).address;

    const allowance = await FTHMToken.methods
      .allowance(address, StakingAddress)
      .call();

    return BigNumber(allowance).isGreaterThanOrEqualTo(
      library.utils.toWei(stakingPosition.toString(), 'ether')
    );
  }

  getStreamClaimableAmountPerLock(
    streamId: number,
    account: string,
    lockId: number,
    library: Xdc3
  ) {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library
    );
    return Staking.methods
      .getStreamClaimableAmountPerLock(streamId, account, lockId)
      .call();
  }

  getStreamClaimableAmount(account: string, library: Xdc3) {
    const StakingGetter = Web3Utils.getContractInstance(
      SmartContractFactory.StakingGetter(this.chainId),
      library
    );
    return StakingGetter.methods.getStreamClaimableAmount(0, account).call();
  }

  getMinLockPeriod(library: Xdc3) {
    const Staking = Web3Utils.getContractInstance(
      SmartContractFactory.Staking(this.chainId),
      library
    );
    return Staking.methods.minLockPeriod().call();
  }

  getPairPrice(token0: string, token1: string, library: Xdc3) {
    const DexPriceOracle = Web3Utils.getContractInstance(
      SmartContractFactory.DexPriceOracle(this.chainId),
      library
    );
    return DexPriceOracle.methods.getPrice(token0, token1).call();
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
