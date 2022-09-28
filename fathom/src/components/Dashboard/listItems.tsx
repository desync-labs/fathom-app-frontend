import {
  useEffect,
  useState
} from "react";
import { FC } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Link, useLocation } from "react-router-dom";

const ItemStyles = (isActive: boolean) => ({
  color: isActive ? "#00FFF6" : "#808084",
  textDecoration: "none",
  border: "none",
  "&:hover": {
    background: "#2B2C31",
    borderRadius: "8px",
    margin: '0 5px'
  },
});

type ItemPropsType = {
  open: boolean;
};

const useShowText = (open: boolean) => {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShowText(open);
      }, 100)
    } else {
      setShowText(open);
    }
  }, [open, setShowText])

  return {
    showText
  }
}

export const MainListItems: FC<ItemPropsType> = ({ open }) => {
  const location = useLocation();
  const isActive = location.pathname === "/";
  const { showText } = useShowText(open);

  return (
    <>
      <Link
        className={isActive ? "active" : ""}
        to="/"
        style={{ textDecoration: "none" }}
      >
        <ListItemButton sx={ItemStyles(isActive)}>
          <ListItemIcon
            sx={{
              color: isActive ? "#00FFF6" : "#808084",
              minWidth: "30px",
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          {showText && (
            <ListItemText primary="Dashboard" sx={{ fontWeight: "bold" }} />
          )}
        </ListItemButton>
      </Link>
    </>
  );
};

export const SecondaryListItems: FC<ItemPropsType> = ({ open }) => {
  const location = useLocation();
  const isActive = location.pathname === "/swap";
  const { showText } = useShowText(open);

  return (
    <>
      <Link
        className={isActive ? "active" : ""}
        to="/swap"
        style={{ textDecoration: "none" }}
      >
        <ListItemButton sx={ItemStyles(isActive)}>
          <ListItemIcon
            sx={{
              color: isActive ? "#00FFF6" : "#808084",
              minWidth: "30px",
            }}
          >
            <SwapHorizIcon />
          </ListItemIcon>
          {showText && (
            <ListItemText primary="Stable Swap" sx={{ fontWeight: "bold" }} />
          )}
        </ListItemButton>
      </Link>
    </>
  );
};
