import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GOVERNANCE_PROPOSALS, GOVERNANCE_STATS } from "apollo/queries";
import { Constants } from "helpers/Constants";
import useSyncContext from "context/sync";
import { useWeb3React } from "@web3-react/core";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";

export const useAllProposals = () => {
  const { chainId } = useWeb3React();
  const [search, setSearch] = useState<string>("");
  const [time, setTime] = useState<string>("all");
  const [proposals, setProposals] = useState<string>("all");

  const [createProposal, setCreateProposal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { syncDao, prevSyncDao } = useSyncContext();

  const { data, loading, refetch, fetchMore } = useQuery(GOVERNANCE_PROPOSALS, {
    variables: {
      first: Constants.COUNT_PER_PAGE,
      skip: 0,
    },
    context: { clientName: "governance", chainId },
  });

  const {
    data: stats,
    loading: statsLoading,
    refetch: statsRefetch,
  } = useQuery(GOVERNANCE_STATS, {
    context: { clientName: "governance" },
  });

  const refetchProposals = useCallback(() => {
    refetch({
      first: Constants.COUNT_PER_PAGE,
      skip: 0,
    });

    statsRefetch();
    setCurrentPage(1);
  }, [refetch, statsRefetch]);

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetchProposals();
    }
  }, [syncDao, prevSyncDao, refetchProposals])

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
    fetchedProposals: loading ? [] : data.proposals,

    currentPage,
    itemsCount:
      statsLoading || !stats || !stats.governanceStats.length ? 0 : stats.governanceStats[0].totalProposalsCount,
    handlePageChange,

    isMobile,
  };
};
