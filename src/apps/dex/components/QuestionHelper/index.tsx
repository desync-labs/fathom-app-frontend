import { FC } from "react";
import { Box } from "@mui/material";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";

const QuestionHelper: FC<{ text: string }> = ({ text }) => {
  return (
    <Box style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
      <AppPopover id={"expanded_token_list"} text={text} />
    </Box>
  );
};

export default QuestionHelper;
