import { ReactElement } from "react";
import { styled } from "@mui/material";

const strategyTitle: { [key: string]: string } = {};
const strategyDescription: { [key: string]: ReactElement } = {};

export const DescriptionList = styled("ul")`
  padding-inline-start: 20px;
`;

strategyDescription["0xa91aebf8c534ae1fe2c70377097d20e2902f8bf8"] = (
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

strategyTitle["0xa91aebf8c534ae1fe2c70377097d20e2902f8bf8"] =
  "FXD Strategy - 3 Months - 100.000 FXD";

export { strategyTitle, strategyDescription };
