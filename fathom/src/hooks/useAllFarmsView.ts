import {
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useState } from "react";


const useAllFarmsView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [farmsCurrentPage, setFarmsCurrentPage] = useState(1);
  const [farmsItemsCount, setFarmsItemsCount] = useState(0);

  return {
    farmsCurrentPage,
    farmsItemsCount,
    isMobile,
    setFarmsCurrentPage,
    setFarmsItemsCount
  }
}

export default useAllFarmsView;