import { useState } from "react";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";


const useFarmListItem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [extended, setExtended] = useState<boolean>(true);
  const [manageFarm, setManageFarm] = useState<boolean>(false);

  return {
    isMobile,
    manageFarm,
    extended,
    setExtended,
    setManageFarm,
  }
}

export default useFarmListItem;