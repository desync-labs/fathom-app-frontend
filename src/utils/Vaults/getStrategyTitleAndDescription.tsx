import { ReactElement } from "react";
import { styled } from "@mui/material";

const strategyTitle: { [key: string]: string } = {};
const strategyDescription: { [key: string]: ReactElement } = {};

export const DescriptionList = styled("ul")`
  padding-inline-start: 20px;
`;

strategyDescription["0xe2dea7e0c272de04e8708674dae73ebd6e5c1455"] = (
  <>
    <p>The Strategy distributes FXD at a variable APY to depositors.</p>
    <DescriptionList>
      <li>
        Consistent: Our approach ensures a steady flow of rewards to Vault
        participants, boosting investment outcomes and securing the Vault's
        growth.
      </li>
      <li>
        Transparent: Trust is key. We share detailed performance and earnings
        reports, keeping operations transparent and secure.
      </li>
      <li>
        Scaled: This Strategy is designed to educate depositors on how future
        RWA Strategy will work.
      </li>
    </DescriptionList>
  </>
);

strategyDescription["0x3adf1e440657fa55d11adb6a102d140b01449139"] = (
  <>
    <p>
      Invest directly in one of the world's leading gold mining companies with
      the Newmont Corp Strategy. This strategy focuses on capitalizing on the
      growth and profitability of Newmont Corporation, renowned for its robust
      mining operations and sustainable mining practices. By investing in NEM,
      participants gain exposure to the operational performance of a top-tier
      gold producer, benefiting from both its market-driven growth and
      dividends.
    </p>
    <b>Key Highlights:</b>
    <DescriptionList>
      <li>
        Stable Growth: Leverage Newmont's consistent performance in the gold
        mining sector.
      </li>
      <li>
        Sustainable Practices: Benefit from Newmont’s commitment to
        environmental, social, and governance (ESG) principles.
      </li>
      <li>
        Dividend Returns: Enjoy potential regular dividend payouts, enhancing
        the investment's income-generating capabilities.
      </li>
    </DescriptionList>
  </>
);

strategyDescription["0xde53c24ddce2d42816450dc06b2caff6384691dc"] = (
  <>
    <p>
      Diversify your investment through the iShares Gold Trust Micro Strategy,
      which invests in IAUM, an exchange-traded fund (ETF) that tracks the price
      of gold. This strategy offers a cost-effective and highly liquid means to
      invest in physical gold, providing a hedge against market volatility and
      inflation without the need to manage physical assets.
    </p>
    <b>Key Highlights:</b>
    <DescriptionList>
      <li>
        Direct Gold Exposure: Track the price movement of gold with lower
        investment thresholds.
      </li>
      <li>
        High Liquidity: Benefit from the ability to quickly and easily trade
        shares of the ETF, similar to trading stocks.
      </li>
      <li>
        Low Expense Ratio: Invest in gold with minimal overhead costs,
        maximizing potential returns.
      </li>
    </DescriptionList>
  </>
);

strategyDescription["0xcea3c48da7aa17d5bc0a588a3e743577d94eb192"] = (
  <>
    <p>
      Engage in the global gold market through Anglogold Ashanti PLC, one of the
      largest gold mining companies in the world. This strategy invests in AU
      shares, offering exposure to Anglogold's international mining operations
      across several continents. With a focus on high-margin, long-life assets,
      this strategy aims to deliver significant growth and robust returns.
    </p>
    <b>Key Highlights:</b>
    <DescriptionList>
      <li>
        Global Reach: Capitalize on Anglogold’s diverse operations in different
        geopolitical regions.
      </li>
      <li>
        High-Margin Assets: Focus on investments that promise higher returns and
        lower operational risks.
      </li>
      <li>
        Growth Potential: Take advantage of Anglogold's strategic expansions and
        operational enhancements.
      </li>
    </DescriptionList>
  </>
);
strategyDescription["0xc0ac2e5181f90fda9e9264b5b1634b2c8bd88cdd"] = (
  <>
    <p>
      The Strategy utilizes funds in the FXD liquidation process. It uses
      several liquidity sources (Fathom DEX, XSwap, etc.) to liquidate risky
      positions in the FXD protocol. If there is insufficient liquidity in the
      market, the Strategy uses internally allocated funds to process the
      liquidation. All liquidation income is considered a gain. Possible
      liquidation debt is compensated by strategy gain and the FXD stability fee
      reserve.
    </p>
  </>
);

strategyDescription["0x0425b4f142059eb15cae157dac4277f89b9894c2"] = (
  <>
    <p>
      The Strategy utilizes funds in Fathom Lending. It supplies certain lending
      pools to achieve the maximum possible gain.
    </p>
  </>
);

strategyDescription["0xb2f928bfd9d2107a7c5b8a2208de4a017cdf1bfc"] = (
  <>
    <p>Strategy based on off-chain TradeFi products.</p>
  </>
);

strategyDescription["0x676a616d4fa846c6699437a4f1209c5808e5b1ab"] = (
  <>
    <h3>Investment description</h3>
    <ul>
      <li>
        Fund transactions backed by over collateralized liquid commodity assets.
      </li>
      <li>
        Multi-year successful track record (Zero defaults, low volatility,
        consistent returns).
      </li>
      <li>
        Each fund transaction is fully insured for loss, damage or theft by
        global insurers.
      </li>
    </ul>
    <p>
      Tradeflow USD is an investment grade Commodity finance fund that has had a
      successful track record since 2018. The TradeFlow funds currently manage
      around $130 million in assets. The TradeFlow funds focus on supporting
      Small Medium size firms in their import/export transactions of physical
      commodities e.g. non-perishable food crops, agricultural farming inputs,
      metals for recycling and some energy products. The fund invests in insured
      physical commodity transactions with a maximum duration of 90 days. This
      means it provides financing for the import and export of physical
      commodities, with the commodities themselves used as the collateral. The
      Vault issuance allows investors to gain exposure to this asset backed
      commodity funding strategy as a short-term, commodity-backed cash
      alternative investment. The funds raised through the Vault product will
      allow the Tradeflow fund to expand its investment capacity.
    </p>
    <h3>Disclaimer</h3>
    <p>
      Investment in the Tradeflow USD fund carries risk. Although the fund has
      had a history of low volatility and no defaults since its inception in
      April 2018, and as of July 1, 2024 carries an A- investment grade senior
      debt rating, there is no guarantee that this performance will continue.
      The fund is registered in the Cayman Islands with the CIMA regulatory
      authority as a mutual fund, and is audited by Deloitte and administered by
      APEX Fund Services based in the DIFC Dubai. APEX group is a regulated fund
      administration group which currently administers over US$2 Trillion
      dollars of assets with over 13,000 employees across 112 offices worldwide.
      TradeFlow Capital Management Pte Ltd, based in Singapore{" "}
      <a href={"https://www.tradeflow.capital"} target={"_blank"}>
        (www.tradeflow.capital)
      </a>
      , is the investment advisor to the fund and manages the day-to-day
      portfolio. APEX Fund Services in the DIFC Dubai manages the independent
      accounting of the fund, generates the official management accounts for
      investor reporting, and reports data directly to Deloitte. Prospective
      investors should consider their own investment objectives, risk tolerance,
      and financial circumstances before investing in the TradeFlow USD fund
      vault.
    </p>
  </>
);

strategyTitle["0xe2dea7e0c272de04e8708674dae73ebd6e5c1455"] =
  "FXD Strategy - 3 Months - 100.000 FXD";

strategyTitle["0x3adf1e440657fa55d11adb6a102d140b01449139"] =
  "Newmont Corp (NEM) Strategy";

strategyTitle["0xde53c24ddce2d42816450dc06b2caff6384691dc"] =
  "iShares Gold Trust Micro (IAUM) Strategy";

strategyTitle["0xcea3c48da7aa17d5bc0a588a3e743577d94eb192"] =
  "Anglogold Ashanti PLC (AU) Strategy";

strategyTitle["0xc0ac2e5181f90fda9e9264b5b1634b2c8bd88cdd"] =
  "FXD - Liquidation Strategy 1";

strategyTitle["0x989a19e29cb9bc194bd35606af8f9a641a4cbce4"] =
  "Liquidation strategy";

strategyTitle["0x4e2fc8a4e62cf515ee7954fd01346cd2501e7e81"] =
  "Lending strategy";

strategyTitle["0x0425b4f142059eb15cae157dac4277f89b9894c2"] =
  "FXD - Lending Strategy 1";

strategyTitle["0xBc8C9999a3D56e799Bb470D8402A9dA121FcBf14"] =
  "Fathom Trade Fintech Strategy 1";

strategyTitle["0xb2f928bfd9d2107a7c5b8a2208de4a017cdf1bfc"] =
  "TradeFlow strategy #1";

strategyTitle["0x676a616d4fa846c6699437a4f1209c5808e5b1ab"] =
  "TradeFlow strategy #1";

strategyTitle["0x00587ac51a5bf897bc8b253e4d49fbea5e62a5cb"] =
  "TradeFlow strategy #1";

export { strategyTitle, strategyDescription };
