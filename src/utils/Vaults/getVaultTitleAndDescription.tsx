import { ReactElement } from "react";
import { styled, Typography } from "@mui/material";
import { VaultType } from "fathom-sdk";

const vaultTitle: { [key: string]: string } = {};
const vaultDescription: { [key: string]: ReactElement } = {};

export const DescriptionList = styled("ul")`
  padding-inline-start: 20px;
`;

export const VaultAboutTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

type ITitleItem = { title: string; index: number; type: VaultType };

export const getDefaultVaultTitle = (
  vaultType: VaultType = VaultType.INCENTIVE,
  asset = "FXD",
  vaultId: string
) => {
  const vaultTitles: { [key: string]: ITitleItem } = sessionStorage.getItem(
    "vaultTitles"
  )
    ? JSON.parse(sessionStorage.getItem("vaultTitles") as string)
    : {};

  if (vaultTitles && vaultTitles[vaultId]) {
    return vaultTitles[vaultId]?.title;
  }

  let title = "";
  let index = 0;
  let type = vaultType;
  let indexes: number[] = [];
  switch (vaultType) {
    case VaultType.DEFI:
      indexes = Object.values(vaultTitles)
        .filter((item) => item.type === VaultType.DEFI)
        .map((item) => item.index as number);
      index = indexes.length ? Math.max(...indexes) : 0;
      index++;
      title = `DeFi vault (${asset}) #${index}`;
      break;
    case VaultType.TRADEFI:
      indexes = Object.values(vaultTitles)
        .filter((item) => item.type === VaultType.TRADEFI)
        .map((item) => item.index as number);
      index = indexes.length ? Math.max(...indexes) : 0;
      index++;
      title = `TradeFi vault (${asset}) #${index}`;
      break;
    case VaultType.INCENTIVE:
      indexes = Object.values(vaultTitles)
        .filter((item) => item.type === VaultType.INCENTIVE)
        .map((item) => item.index as number);
      index = indexes.length ? Math.max(...indexes) : 0;
      index++;
      title = `Incentive vault (${asset}) #${index}`;
      break;
    default:
      indexes = Object.values(vaultTitles)
        .filter((item) => item.type === VaultType.INCENTIVE)
        .map((item) => item.index as number);
      index = indexes.length ? Math.max(...indexes) : 0;
      index++;
      type = VaultType.INCENTIVE;
      title = `Incentive vault (${asset}) #${index}`;
      break;
  }

  vaultTitles[vaultId] = { title, index, type };

  sessionStorage.setItem("vaultTitles", JSON.stringify(vaultTitles));

  return title;
};

export const getDefaultVaultDescription = (
  vaultType: VaultType = VaultType.INCENTIVE
): ReactElement => {
  switch (vaultType) {
    case VaultType.DEFI:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various DeFi product strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies such as yield
          farming, lending, borrowing, etc. In return, the user receives a vault
          share token. Note that this token is not 1:1 equivalent with FXD
          deposited. The FXD vault only charges performance fees as a percentage
          of the strategies manager's fees. Strategies managers can set
          individual management fees, but only for gain. Note that the vault
          smart contracts have been carefully audited. Nevertheless, as always
          in DeFi, users are exposed to smart contract risk. The vault smart
          contracts themselves are non-custodial. Fathom is not responsible for
          the security of strategies created by a 3-rd party or in partnership
          with a 3-rd party.
        </>
      );
    case VaultType.TRADEFI:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various TradeFi product strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies such as
          commodity-backed cash alterfiative. In return, the user receives a
          vault share token. Note that this token is not 1:1 equivalent with FXD
          deposited. The FXD vault only charges performance fees as a percentage
          of the strategies manager's fees. Strategies managers can set
          individual management fees, but only for gain. Note that the vault
          smart contracts have been carefully audited. Nevertheless, as always
          in DeFi, users are exposed to smart contract risk. The vault smart
          contracts themselves are non-custodial. Fathom is not responsible for
          the security of strategies created by a 3-rd party or in partnership
          with a 3-rd party.
        </>
      );
    case VaultType.INCENTIVE:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various incentive strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies created to
          incentivize users to participate in the Fathom protocol. In return,
          the user receives a vault share token. Note that this token is not 1:1
          equivalent with FXD deposited. The FXD vault only charges performance
          fees as a percentage of the strategies manager's fees. Strategies
          managers can set individual management fees, but only for gain. Note
          that the vault smart contracts have been carefully audited.
          Nevertheless, as always in DeFi, users are exposed to smart contract
          risk. The vault smart contracts themselves are non-custodial. Fathom
          is not responsible for the security of strategies created by a 3-rd
          party or in partnership with a 3-rd party.
        </>
      );
    default:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various incentive strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies created to
          incentivize users to participate in the Fathom protocol. In return,
          the user receives a vault share token. Note that this token is not 1:1
          equivalent with FXD deposited. The FXD vault only charges performance
          fees as a percentage of the strategies manager's fees. Strategies
          managers can set individual management fees, but only for gain. Note
          that the vault smart contracts have been carefully audited.
          Nevertheless, as always in DeFi, users are exposed to smart contract
          risk. The vault smart contracts themselves are non-custodial. Fathom
          is not responsible for the security of strategies created by a 3-rd
          party or in partnership with a 3-rd party.
        </>
      );
  }
};

vaultDescription["0x50d150069a0fce09e6ded55a75aec67d2be79037".toLowerCase()] = (
  <>
    <VaultAboutTitle>
      Gold World ETF Vault: Bridging Traditional Assets and Decentralized
      Finance
    </VaultAboutTitle>
    <p>
      Welcome to the Gold World ETF Vault, a pioneering real-world asset (RWA)
      investment platform that seamlessly integrates the stability of
      traditional asset investments with the innovation of decentralized
      finance. This vault offers a unique opportunity for users to diversify
      their portfolios by investing in precious commodities like gold,
      delivering both security and profitability.
    </p>
    <b>Key Features:</b>
    <DescriptionList>
      <li>
        Direct Investment in RWAs: Users can directly invest their funds into a
        curated selection of real-world assets, primarily gold, known for its
        enduring value and stability.
      </li>
      <li>
        Automated Returns Distribution: Leveraging advanced algorithms, the
        vault redistributes generated interest back to the users, ensuring a
        passive income stream.
      </li>
      <li>
        High Transparency and Security: Each investment is meticulously recorded
        and audited, with a clear tracking mechanism that ensures full
        transparency and security of the assets.
      </li>
      <li>
        Performance-Based Fee Structure: No management fees are charged. A
        performance fee is only applied when profits are realized, aligning our
        interests with those of our investors.
      </li>
      <li>
        Risk Mitigation: While investments in RWAs reduce exposure to volatile
        digital assets, they still carry risks. Our platform uses stringent risk
        assessment protocols to mitigate these, ensuring your investments are as
        safe as possible.
      </li>
    </DescriptionList>
    <p>
      By participating in the Gold World ETF Vault, investors gain access to a
      traditionally exclusive market through a decentralized platform, enjoying
      the benefits of both worlds without the typical barriers to entry. Invest
      with confidence and watch your digital and traditional assets grow
      together.
    </p>
  </>
);

vaultDescription["0x5a51e6d4c58f1585d74ce71cf709c4f939c3dac2".toLowerCase()] = (
  <>
    <ul>
      <li>
        <strong>1. Sponsorship and Management:</strong> <br /> Fathom Vault is a
        decentralized finance (DeFi) vault technology platform. The vault is
        sponsored by TradeFlow Capital, a licensed asset manager responsible for
        attracting stablecoin investors and reinvesting the funds in trade
        finance deals. TradeFlow Capital manages all investment activities,
        including the sourcing, evaluation, and execution of trade finance
        deals.
      </li>
      <li>
        <strong>2. Know Your Customer (KYC) and Terms Agreement: </strong>{" "}
        <br />
        All participants in the Fathom Vault must undergo and pass the KYC
        process conducted by TradeFlow Capital. By participating, investors
        agree to the terms and conditions set forth by TradeFlow Capital. Fathom
        Vault is not involved in the KYC process and does not have access to or
        control over the information provided by investors for KYC purposes.
      </li>
      <li>
        <strong>3. Liability Disclaimer:</strong> <br /> Fathom Vault operates
        solely as a technology platform facilitating the operation of the vault.
        Fathom Vault does not manage, control, or influence the investment
        decisions made by TradeFlow Capital. All investment activities,
        including but not limited to the reinvestment in trade finance deals,
        are conducted by TradeFlow Capital under their regulatory and compliance
        framework.
      </li>
      <li>
        <strong>4. Limitation of Liability:</strong> <br /> Fathom Vault, its
        affiliates, and its technology partners shall not be liable for any
        direct, indirect, incidental, special, or consequential damages arising
        from or in connection with the use of the platform, including but not
        limited to investment losses, loss of profits, or loss of data.
        Investors acknowledge and agree that their participation in the vault is
        at their own risk and that Fathom Vault provides no guarantees or
        warranties regarding the performance of the investments managed by
        TradeFlow Capital.
      </li>
      <li>
        <strong>5. Indemnification:</strong> <br /> Investors agree to
        indemnify, defend, and hold harmless Fathom Vault, its affiliates,
        officers, directors, employees, and agents from and against any claims,
        liabilities, damages, losses, and expenses, including reasonable
        attorney's fees, arising out of or in any way connected with their use
        of the platform, their investment decisions, or their breach of these
        terms.
      </li>
      <li>
        <strong>6. Jurisdiction and Governing Law:</strong> <br /> These terms
        and any disputes arising out of or relating to these terms or the use of
        the platform shall be governed by and construed in accordance with the
        laws of the Marshall Islands. Any legal action or proceeding relating to
        these terms shall be brought exclusively in the arbitration courts of
        the Marshall Islands.
      </li>
      <li>
        <strong>7. Severability:</strong> <br /> If any provision of these terms
        is found to be invalid or unenforceable, the remaining provisions shall
        continue to be valid and enforceable to the fullest extent permitted by
        law.
      </li>
    </ul>
  </>
);

vaultTitle["0x50d150069a0fce09e6ded55a75aec67d2be79037".toLowerCase()] =
  "Gold World ETF";
vaultTitle["0xbf4adcc0a8f2c7e29f934314ce60cf5de38bfe8f".toLowerCase()] =
  "Trade Fintech Vault";
vaultTitle["0x3c8e9896933b374e638f9a5c309535409129aaa2".toLowerCase()] =
  "Education Vault";
vaultTitle["0x5a51e6d4c58f1585d74ce71cf709c4f939c3dac2".toLowerCase()] =
  "TradeFi Vault (FXD) #1";
vaultTitle["0x7e5c3caD163963d7AFef7143a19919310243AC21".toLowerCase()] =
  "TradeFi Vault (AutoTest)";

export { vaultTitle, vaultDescription };
