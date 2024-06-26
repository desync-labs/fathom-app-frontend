import { FC } from "react";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { Button, styled } from "@mui/material";

import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const PaginationActionBtn = styled(Button)`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  background: transparent;
  border: none;
  min-width: unset;
`;

const CurrentPageInfo = styled("span")`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  padding: 0 8px;
`;

type AppPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const AppPagination: FC<AppPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <AppFlexBox
      sx={{
        justifyContent: "center",
        gap: "12px",
        height: "36px",
        margin: "12px 0",
      }}
    >
      <PaginationActionBtn
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </PaginationActionBtn>
      <PaginationActionBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <KeyboardArrowLeftRoundedIcon />
      </PaginationActionBtn>
      <CurrentPageInfo>
        {currentPage} / {totalPages}
      </CurrentPageInfo>
      <PaginationActionBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <KeyboardArrowRightRoundedIcon />
      </PaginationActionBtn>
      <PaginationActionBtn
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </PaginationActionBtn>
    </AppFlexBox>
  );
};

export default AppPagination;
