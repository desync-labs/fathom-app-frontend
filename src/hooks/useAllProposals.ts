import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSALS, GOVERNANCE_STATS } from "apollo/queries";
import { COUNT_PER_PAGE } from "utils/Constants";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

export const useAllProposals = () => {
  const { chainId } = useConnector();
  const [search, setSearch] = useState<string>("");
  const [time, setTime] = useState<string>("all");
  const [proposals, setProposals] = useState<string>("all");

  const [createProposal, setCreateProposal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { syncDao, prevSyncDao } = useSyncContext();

  const { data, loading, refetch, fetchMore } = useQuery(GOVERNANCE_PROPOSALS, {
    variables: {
      first: COUNT_PER_PAGE,
      skip: 0,
    },
    context: { clientName: "governance", chainId },
  });

  const {
    data: stats,
    loading: statsLoading,
    refetch: statsRefetch,
  } = useQuery(GOVERNANCE_STATS, {
    context: { clientName: "governance", chainId },
  });

  const refetchProposals = useCallback(() => {
    refetch({
      first: COUNT_PER_PAGE,
      skip: 0,
    });

    statsRefetch();
    setCurrentPage(1);
  }, [refetch, statsRefetch]);

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetchProposals();
    }
  }, [syncDao, prevSyncDao, refetchProposals]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
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
    fetchedProposals: loading ? [] : data.proposals,
    currentPage,
    itemsCount:
      statsLoading || !stats || !stats.governanceStats.length
        ? 0
        : stats.governanceStats[0].totalProposalsCount,
    handlePageChange,
  };
};
