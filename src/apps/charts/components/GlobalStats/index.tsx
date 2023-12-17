import styled from "styled-components";
import { RowBetween } from "apps/charts/components/Row";
import { useMedia } from "react-use";
import {
  useGlobalData,
  useEthPrice,
  useFxdPrice,
  useFTHMPrice,
} from "apps/charts/contexts/GlobalData";
import { formattedNum } from "apps/charts/utils";
import { Box } from "rebass/styled-components";

import { getTokenLogoURL } from "apps/charts/utils/getTokenLogo";

import transferSrc from "apps/charts/assets/transfer.svg";
import dollarSrc from "apps/charts/assets/dollar.svg";

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`;

const GridStats = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const GridStatsItem = styled.div`
  background-color: #131f35;
  height: auto;
  max-height: 68px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 12px;
  gap: 20px;
  @media (max-width: 600px) {
    padding: 10px;
    gap: 10px;
  }
  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const TextWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ImgWrapper = styled(Box)`
  background: #061023;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-size: 10px;
  color: #6379a1;
  font-weight: 600;
  text-transform: uppercase;
`;

const Value = styled.div`
  font-size: 16px;
  color: #fff;
  font-weight: 600;
`;

export default function GlobalStats() {
  const below800 = useMedia("(max-width: 800px)");

  const { oneDayVolumeUSD, oneDayTxns } = useGlobalData();
  const [ethPrice] = useEthPrice();
  const { fxdPrice } = useFxdPrice();
  const { fthmPrice } = useFTHMPrice();

  const formattedEthPrice = ethPrice ? formattedNum(ethPrice, true) : "-";
  const formattedFxdPrice = fxdPrice ? formattedNum(fxdPrice, true) : "-";
  const formattedFthmPrice = fthmPrice ? formattedNum(fthmPrice, true) : "-";

  const oneDayFees = oneDayVolumeUSD
    ? formattedNum(oneDayVolumeUSD * 0.003, true)
    : "";

  return (
    <Header>
      <RowBetween style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        <GridStats>
          <>
            <GridStatsItem>
              <ImgWrapper>
                <img
                  src={getTokenLogoURL("FTHM")}
                  alt="fthm"
                  width={24}
                  height={24}
                />
              </ImgWrapper>
              <TextWrapper>
                <Title>FTHM Price</Title>
                <Value>{formattedFthmPrice}</Value>
              </TextWrapper>
            </GridStatsItem>
            <GridStatsItem>
              <ImgWrapper>
                <img
                  src={getTokenLogoURL("WXDC")}
                  alt="xdc"
                  width={26}
                  height={26}
                />
              </ImgWrapper>
              <TextWrapper>
                <Title>XDC Price</Title>
                <Value>{formattedEthPrice}</Value>
              </TextWrapper>
            </GridStatsItem>
            <GridStatsItem>
              <ImgWrapper>
                <img
                  src={getTokenLogoURL("FXD")}
                  alt="fxd"
                  width={26}
                  height={26}
                />
              </ImgWrapper>
              <TextWrapper>
                <Title>FXD Price</Title>
                <Value>{formattedFxdPrice}</Value>
              </TextWrapper>
            </GridStatsItem>
          </>
          {!below800 && (
            <GridStatsItem>
              <ImgWrapper>
                <img src={transferSrc} alt="transfer" width={24} />
              </ImgWrapper>
              <TextWrapper>
                <Title>Transactions (24h)</Title>
                <Value>{oneDayTxns}</Value>
              </TextWrapper>
            </GridStatsItem>
          )}

          {!below800 && (
            <GridStatsItem>
              <ImgWrapper>
                <img src={dollarSrc} alt="transfer" width={24} />
              </ImgWrapper>
              <TextWrapper>
                <Title>Fees (24h)</Title>
                <Value>{oneDayFees}</Value>
              </TextWrapper>
            </GridStatsItem>
          )}
        </GridStats>
      </RowBetween>
    </Header>
  );
}
