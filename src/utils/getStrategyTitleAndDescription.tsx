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

strategyDescription["0x0767644e57c373a210b6f1f1c4692181bedab6a1"] = (
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

strategyDescription["0x3af9bd516e8e58bca804b1f78d169f13d12ba9df"] = (
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

strategyDescription["0xe18fae6426fdbd7eb69e7a26ef8bc45e8a9b6c11"] = (
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

strategyTitle["0xe2dea7e0c272de04e8708674dae73ebd6e5c1455"] =
  "FXD Strategy - 3 Months - 100.000 FXD";

strategyTitle["0x0767644e57c373a210b6f1f1c4692181bedab6a1"] =
  "Newmont Corp (NEM) Strategy";

strategyTitle["0x3af9bd516e8e58bca804b1f78d169f13d12ba9df"] =
  "iShares Gold Trust Micro (IAUM) Strategy";

strategyTitle["0xe18fae6426fdbd7eb69e7a26ef8bc45e8a9b6c11"] =
  "Anglogold Ashanti PLC (AU) Strategy";

export { strategyTitle, strategyDescription };
