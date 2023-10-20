import { useState } from "react";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";


const useVaultListItem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [extended, setExtended] = useState<boolean>(true);
  const [manageVault, setManageVault] = useState<boolean>(false);

  return {
    isMobile,
    manageVault,
    extended,
    setExtended,
    setManageVault,
  }
}

export default useVaultListItem;