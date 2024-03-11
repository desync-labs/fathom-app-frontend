import { FC } from "react";
import { Box, styled, Typography, useMediaQuery } from "@mui/material";
import { RowBetween, RowFixed } from "apps/charts/components/Row";
import { ButtonDark } from "apps/charts/components/ButtonStyled";
import { AutoColumn } from "apps/charts/components/Column";
import { Hover } from "apps/charts/components";
import Link from "apps/charts/components/Link";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const WarningWrapper = styled(Box)<{ show?: boolean }>`
  border-radius: 20px;
  border: 1px solid #f82d3a;
  background: rgba(248, 45, 58, 0.05);
  padding: 1rem;
  color: #f82d3a;
  display: ${({ show }) => !show && "none"};
  margin: 0 2rem 2rem 2rem;
  position: relative;

  @media screen and (max-width: 800px) {
    width: 80% !important;
    margin-left: 5%;
  }
`;

type WarningProps = {
  type: string;
  show?: boolean;
  setShow: any;
  address: string;
};

const Warning: FC<WarningProps> = (props) => {
  const { type, show, setShow, address } = props;
  const below800 = useMediaQuery("(max-width: 800px)");

  const textContent = below800 ? (
    <div>
      <Typography fontWeight={500} lineHeight={"145.23%"} mt={"10px"}>
        Anyone can create and name any XRC20 token on XDC, including creating
        fake versions of existing tokens and tokens that claim to represent
        projects that do not have a token.
      </Typography>
      <Typography fontWeight={500} lineHeight={"145.23%"} mt={"10px"}>
        Similar to BlocksScan, this site automatically tracks analytics for all
        XRC20 tokens independent of token integrity. Please do your own research
        before interacting with any XRC20 token.
      </Typography>
    </div>
  ) : (
    <Typography fontWeight={500} lineHeight={"145.23%"} mt={"10px"}>
      Anyone can create and name any XRC20 token on BlocksScan, including
      creating fake versions of existing tokens and tokens that claim to
      represent projects that do not have a token. Similar to BlocksScan, this
      site automatically tracks analytics for all XRC20 tokens independent of
      token integrity. Please do your own research before interacting with any
      XRC20 token.
    </Typography>
  );

  return (
    <WarningWrapper show={show}>
      <AutoColumn gap="4px">
        <RowFixed>
          <WarningAmberIcon />
          <Typography fontWeight={600} lineHeight={"145.23%"} ml={"10px"}>
            Token Safety Alert
          </Typography>
        </RowFixed>
        {textContent}
        {below800 ? (
          <div>
            <Hover style={{ marginTop: "10px" }}>
              <Link
                fontWeight={500}
                color={"#2172E5"}
                href={
                  `https://xdc.blocksscan.io/${
                    type === "token" ? "tokens" : "address"
                  }/` + address
                }
                external
              >
                View {type === "token" ? "token" : "pair"} contract on
                BlocksScan
              </Link>
            </Hover>
            <RowBetween style={{ marginTop: "20px" }}>
              <div />
              <ButtonDark
                sx={{ color: "#f82d3a", minWidth: "140px" }}
                onClick={() => setShow(false)}
              >
                I understand
              </ButtonDark>
            </RowBetween>
          </div>
        ) : (
          <RowBetween style={{ marginTop: "10px" }}>
            <Hover>
              <Link
                fontWeight={500}
                color={"#2172E5"}
                href={
                  `https://xdc.blocksscan.io/${
                    type === "token" ? "tokens" : "address"
                  }/` + address
                }
                external
              >
                View {type === "token" ? "token" : "pair"} contract on
                BlocksScan
              </Link>
            </Hover>
            <ButtonDark
              sx={{ minWidth: "140px" }}
              onClick={() => setShow(false)}
            >
              I understand
            </ButtonDark>
          </RowBetween>
        )}
      </AutoColumn>
    </WarningWrapper>
  );
};

export default Warning;
