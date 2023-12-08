import { Dispatch, FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { Menu } from "components/Dashboard/Menu";

const MobileMenuWrapper = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 300px;
  background: #131f35;
  z-index: 1000;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 20px;
  border-top: 1px solid #192c46;
  > a {
    margin-bottom: 14px;
  }
`;

type MobileMenuPropsType = {
  setOpenMobile: Dispatch<boolean>;
};

const MobileMenu: FC<MobileMenuPropsType> = ({ setOpenMobile }) => {
  return (
    <MobileMenuWrapper onClick={() => setOpenMobile(false)}>
      <Menu open={true} />
    </MobileMenuWrapper>
  );
};

export default MobileMenu;
