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

export { strategyTitle, strategyDescription };
