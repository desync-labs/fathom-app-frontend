import PositionsList from "components/PositionList/PositionsList";
import ProtocolStats from "components/Dashboard/ProtocolStats";
import PoolsListView from "components/Pools/PoolsListView";
import BasePageHeader from "components/Base/PageHeader";
import BasePageContainer from "components/Base/PageContainer";
import useDashboard from "context/fxd";

const DashboardContent = () => {
  const {
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
    loadingPositions,
    fetchProxyWallet,
  } = useDashboard();

  return (
    <BasePageContainer>
      <BasePageHeader
        title={"FXD"}
        description={`FXD is overcollateralized, decentralized, and softly pegged stablecoin.`}
      />
      <ProtocolStats />
      <PoolsListView
        proxyWallet={proxyWallet}
        fetchProxyWallet={fetchProxyWallet}
      />
      <PositionsList
        loadingPositions={loadingPositions}
        positionCurrentPage={positionCurrentPage}
        positionsItemsCount={positionsItemsCount}
        proxyWallet={proxyWallet}
        setPositionCurrentPage={setPositionCurrentPage}
      />
    </BasePageContainer>
  );
};

export default DashboardContent;
