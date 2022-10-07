import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";

import {
  ExpandLess as IconExpandLess,
  ExpandMore as IconExpandMore,
} from "@mui/icons-material";

import AppMenuItemComponent from "./AppMenuItemComponent";
import { Collapse, ListItemIcon, ListItemText, List } from "@mui/material";

// React runtime PropTypes
export const AppMenuItemPropTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.any,
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

const useStyles = makeStyles<{ isActive: boolean; showText: boolean }>()(
  (theme, { isActive, showText }) => ({
    menuItem: {
      "&.active": {
        background: isActive ? "#2A3E5A" : "transparent",
        borderRadius: isActive ? "8px" : "0",
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
        paddingLeft: "30px",
      },
      margin: "6px 0",
      padding: showText ? "4px 16px 10px 16px" : "12px",
    },
    menuItemIcon: {
      color: isActive ? theme.palette.primary.main : "#415D83",
      minWidth: "0",
      paddingRight: showText ? "7px" : "0",
    },
    menuItemText: {
      "> span": {
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: "20px",
      },
      paddingBottom: "4px",
      color: isActive ? "#fff" : "#B0C5E7",
      marginBottom: "-4px"
    },
  })
);

const AppMenuItem: React.FC<AppMenuItemProps> = (props) => {
  const { name, link, Icon, items = [], isActive, showText } = props;
  const isExpandable = items && items.length > 0 && showText;

  const { classes } = useStyles({
    isActive: isActive!,
    showText: showText!,
  });
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
      {isExpandable && !open && <IconExpandMore sx={{ pt: '6px' }} />}
      {isExpandable && open && <IconExpandLess sx={{ pt: '6px' }} />}
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
