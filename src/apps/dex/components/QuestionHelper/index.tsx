import { FC } from "react";
import { Box } from "@mui/material";
import BasePopover from "components/Base/Popover/BasePopover";

const QuestionHelper: FC<{ text: string }> = ({ text }) => {
  return (
    <Box style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
      <BasePopover id={"expanded_token_list"} text={text} />
    </Box>
  );
};

export default QuestionHelper;
