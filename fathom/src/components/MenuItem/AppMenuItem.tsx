import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";

import {
  ExpandLess as IconExpandLess,
  ExpandMore as IconExpandMore,
} from "@mui/icons-material";

import AppMenuItemComponent from "./AppMenuItemComponent";
import {
  Collapse,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";

// React runtime PropTypes
export const AppMenuItemPropTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.elementType,
  items: PropTypes.array,
  isActive: PropTypes.bool,
  showText: PropTypes.bool,
};

// TypeScript compile-time props type, infered from propTypes
// https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88
type AppMenuItemPropTypes = PropTypes.InferProps<typeof AppMenuItemPropTypes>;
type AppMenuItemPropsWithoutItems = Omit<AppMenuItemPropTypes, "items">;

// Improve child items declaration
export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
  items?: AppMenuItemProps[];
};

const useStyles = makeStyles<boolean>()((theme, isActive) => ({
  menuItem: {
    "&.active": {
      background: isActive ? "#2A3E5A" : "transparent",
      borderRadius: isActive ? "8px" : "0",
      padding: "8px 16px",
      "& .MuiListItemIcon-root": {
        color: isActive
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
      },
    },
    "&:hover": {
      background: "#2A3E5A",
      borderRadius: "8px",
    },
    "& .MuiListItemText-inset": {
      paddingLeft: "30px"
    },
    margin: "6px 0"
  },
  menuItemIcon: {
    color: isActive ? theme.palette.primary.main : "#415D83",
    minWidth: "0",
    paddingRight: "7px",
  },
  menuItemText: {
    color: isActive ? "#fff" : "#B0C5E7",
    fontSize: "14px",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "20px",
  },
}));

const AppMenuItem: React.FC<AppMenuItemProps> = (props) => {
  const { name, link, Icon, items = [], isActive, showText } = props;
  const { classes } = useStyles(isActive!);

  let isExpandable = items && items.length > 0 && showText;
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = (
    <AppMenuItemComponent
      className={classes.menuItem}
      link={link}
      onClick={handleClick}
    >
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon className={classes.menuItemIcon}>
          <Icon />
        </ListItemIcon>
      )}
      {showText && (
        <ListItemText
          className={classes.menuItemText}
          primary={name}
          inset={!Icon}
        />
      )}
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
    </AppMenuItemComponent>
  );

  const MenuItemChildren =
    isExpandable || !showText ? (
      <Collapse in={open || !showText!} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item, index) => (
            <AppMenuItem {...item} key={index} />
          ))}
        </List>
      </Collapse>
    ) : null;

  return (
    <>
      {showText ? MenuItemRoot : Icon ? MenuItemRoot : null}
      {MenuItemChildren}
    </>
  );
};

export default AppMenuItem;
