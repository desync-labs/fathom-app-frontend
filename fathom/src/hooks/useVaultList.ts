import {
  useCallback,
  useMemo
} from "react";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";


const useVaultList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePageChange = useCallback(() => {

  }, [])

  const noResults = useMemo(() => {
    return false;
  }, [])

  return {
    isMobile,
    handlePageChange,
    loading: false,
    noResults,
  }
}

export default useVaultList;