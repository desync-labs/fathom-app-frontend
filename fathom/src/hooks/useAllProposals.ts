import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSALS, GOVERNANCE_STATS } from "apollo/queries";
import { Constants } from "helpers/Constants";
import { SmartContractFactory } from "config/SmartContractFactory";
import { useWeb3React } from "@web3-react/core";

export const useAllProposals = () => {
  const { chainId } = useWeb3React();

  const [search, setSearch] = useState<string>("");
  const [time, setTime] = useState<string>("all");
  const [proposals, setProposals] = useState<string>("all");

  const [createProposal, setCreateProposal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const GovernanceAddress = useMemo(
    () => SmartContractFactory.FathomGovernor(chainId!).address,
    [chainId]
  );

  const { data, loading, refetch, fetchMore } = useQuery(GOVERNANCE_PROPOSALS, {
    variables: {
      first: Constants.COUNT_PER_PAGE,
      skip: 0,
    },
    context: { clientName: "governance" },
  });

  const [
    fetchStats,
    { data: stats, loading: statsLoading, refetch: statsRefetch },
  ] = useLazyQuery(GOVERNANCE_STATS, {
    context: { clientName: "governance" },
  });

  useEffect(() => {
    fetchStats({
      variables: {
        id: GovernanceAddress,
      },
    });
  }, [fetchStats, GovernanceAddress]);

  const refetchProposals = useCallback(() => {
    setTimeout(() => {
      refetch({
        first: Constants.COUNT_PER_PAGE,
        skip: 0,
      });

      statsRefetch({
        id: GovernanceAddress,
      });
      setCurrentPage(1);
    }, 1000);
  }, [refetch, statsRefetch, GovernanceAddress]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMore({
        variables: {
          first: Constants.COUNT_PER_PAGE,
          skip: (page - 1) * Constants.COUNT_PER_PAGE,
        },
      });
      setCurrentPage(page);
    },
    [setCurrentPage, fetchMore]
  );

  return {
    fetchProposalsPending: loading,
    search,
    setSearch,
    time,
    setTime,
    proposals,
    setProposals,
    createProposal,
    setCreateProposal,
    refetchProposals,
    fetchedProposals: loading ? [] : data.proposals,

    currentPage,
    itemsCount:
      statsLoading || !stats ? 0 : stats.governanceStat.totalProposalsCount,
    handlePageChange,
  };
};
