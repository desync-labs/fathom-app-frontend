import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Box, styled } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import { IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { formatNumber } from "utils/format";
import usePricesContext from "context/prices";
import { VAULTS_ACCOUNT_TRANSACTIONS } from "apollo/queries";
import useConnector from "context/connector";
import { AppSkeletonValue } from "components/AppComponents/AppSkeleton/AppSkeleton";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";

import { ReactComponent as DepositedIcon } from "assets/svg/icons/vault-stats-deposited.svg";
import { ReactComponent as EarnedIcon } from "assets/svg/icons/vault-stats-earning.svg";

const StatItemWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  border-radius: 12px;
  background: #1e2f4c;
  padding: 20px 24px;
`;
const StatItemLabel = styled(Box)`
  color: #6d86b2;
  font-size: 20px;
  font-weight: 600;
  line-height: 16px;
  text-transform: capitalize;
`;
const StatItemValue = styled(Box)`
  color: #fff;
  text-align: right;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
`;

enum TransactionFetchType {
  FETCH = "fetch",
  PROMISE = "promise",
}

type VaultsTotalStatsType = {
  positionsList: IVaultPosition[];
  positionsLoading: boolean;
};
type StatItemPropsType = { title: string; value: string; icon: JSX.Element };

const StatItem: FC<StatItemPropsType> = ({ title, value, icon }) => {
  const { fxdPrice, fetchPricesInProgress } = usePricesContext();
  return (
    <StatItemWrapper>
      <AppFlexBox sx={{ gap: 2 }}>
        {icon}
        <StatItemLabel>{title}</StatItemLabel>
      </AppFlexBox>
      <StatItemValue>
        {value === "-1" || fetchPricesInProgress ? (
          <AppSkeletonValue animation={"wave"} width={110} height={28} />
        ) : BigNumber(value).isGreaterThan(0) ? (
          `$${formatNumber(
            BigNumber(value)
              .multipliedBy(fxdPrice)
              .dividedBy(10 ** 36)
              .toNumber()
          )}`
        ) : (
          "$0"
        )}
      </StatItemValue>
    </StatItemWrapper>
  );
};

const VaultsTotalStats: FC<VaultsTotalStatsType> = ({
  positionsList,
  positionsLoading,
}) => {
  const [totalBalance, setTotalBalance] = useState("-1");
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  const { chainId, account } = useConnector();

  const [loadAccountTransactions, { refetch: refetchTransactions }] =
    useLazyQuery(VAULTS_ACCOUNT_TRANSACTIONS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId },
      fetchPolicy: "no-cache",
    });

  const fetchPositionTransactions = useCallback(
    (fetchType: TransactionFetchType = TransactionFetchType.FETCH) => {
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return refetchTransactions({
            account: account.toLowerCase(),
            chainId,
          });
        }

        setTransactionsLoading(true);

        return loadAccountTransactions({
          variables: {
            account: account.toLowerCase(),
            chainId,
          },
        })
          .then((res) => {
            res.data?.deposits && setDepositsList(res.data.deposits);
            res.data?.withdrawals && setWithdrawalsList(res.data.withdrawals);
          })
          .finally(() => setTransactionsLoading(false));
      } else {
        setDepositsList([]);
        setWithdrawalsList([]);
        return;
      }
    },
    [
      chainId,
      account,
      setDepositsList,
      setTransactionsLoading,
      loadAccountTransactions,
      refetchTransactions,
    ]
  );

  useEffect(() => {
    const totalBalance = positionsList.reduce((acc, position) => {
      return BigNumber(acc).plus(position.balancePosition);
    }, BigNumber(0));
    setTotalBalance(totalBalance.toString());
  }, [positionsList, setTotalBalance]);

  useEffect(() => {
    fetchPositionTransactions();
  }, [account, fetchPositionTransactions]);

  const balanceEarned = useMemo(() => {
    if (totalBalance === "-1") return "0";

    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    return transactionsLoading
      ? "-1"
      : BigNumber(totalBalance || "0")
          .minus(sumTokenDeposits.minus(sumTokenWithdrawals))
          .toString();
  }, [totalBalance, depositsList, withdrawalsList, transactionsLoading]);

  return (
    <AppFlexBox sx={{ gap: "16px", padding: "40px 0" }}>
      <StatItem
        title="Deposited"
        value={totalBalance}
        icon={<DepositedIcon />}
      />
      <StatItem title="Earnings" value={balanceEarned} icon={<EarnedIcon />} />
    </AppFlexBox>
  );
};

export default VaultsTotalStats;
