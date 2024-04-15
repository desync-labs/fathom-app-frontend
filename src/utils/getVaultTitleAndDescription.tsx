import { ReactElement } from "react";
import { styled, Typography } from "@mui/material";

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
  margin-bottom: 16px;
`;

vaultDescription["0xd43a604f2c04867d61d59c2a4b4a35dd1104c669"] = (
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

vaultTitle["0xd43a604f2c04867d61d59c2a4b4a35dd1104c669"] = "Gold World ETF";

export { vaultTitle, vaultDescription };
