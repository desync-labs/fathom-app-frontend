import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";
import { FC, useState, memo } from "react";

import {
  ExpandLess as IconExpandLess,
  ExpandMore as IconExpandMore,
} from "@mui/icons-material";

import AppMenuItemComponent from "components/MenuItem/AppMenuItemComponent";
import { Collapse, ListItemIcon, ListItemText, List } from "@mui/material";

// React runtime PropTypes
export const AppMenuItemPropTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  Icon: PropTypes.any,
  items: PropTypes.array,
  isActive: PropTypes.bool,
  showText: PropTypes.bool,
  target: PropTypes.string,
};

// TypeScript compile-time props type, infered from propTypes
// https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88
type AppMenuItemPropTypesType = PropTypes.InferProps<
  typeof AppMenuItemPropTypes
>;
type AppMenuItemPropsWithoutItems = Omit<AppMenuItemPropTypesType, "items">;

// Improve child items declaration
export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
  items?: AppMenuItemProps[];
};

const useStyles = makeStyles<{ isActive: boolean; showText: boolean }>()(
  (theme, { isActive, showText }) => ({
    menuItem: {
      margin: "0 auto",
      padding: "8px 16px",
      width: showText ? "100%" : "40px",
      borderRadius: "8px",
      justifyContent: showText ? "flex-start" : "center",
      "&.active": {
        backgroundColor: isActive ? "#2C4066" : "transparent",

        "& .MuiListItemIcon-root": {
          color: isActive
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
        },
      },
      "&:hover": {
        background: "#2C4066",
        borderRadius: "8px",
      },
      "& .MuiListItemText-inset": {
        paddingLeft: "30px",
      },
    },
    menuItemIcon: {
      color: isActive ? theme.palette.primary.main : "#415D83",
      minWidth: "0",
      marginRight: showText ? "16px" : "0",
    },
    menuItemText: {
      "> span": {
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: "20px",
      },
      margin: "0",
      color: isActive ? "#fff" : "#B0C5E7",
    },
  })
);

const AppMenuItem: FC<AppMenuItemProps> = memo((props) => {
  const { name, link, Icon, items = [], isActive, showText } = props;
  const isExpandable = items && items.length > 0 && showText;

  const { classes } = useStyles({
    isActive: isActive as boolean,
    showText: showText as boolean,
  });
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = (
    <AppMenuItemComponent
      className={classes.menuItem}
      link={link}
      onClick={handleClick}
      target={props.target}
    >
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon className={classes.menuItemIcon}>{Icon}</ListItemIcon>
      )}
      {showText && (
        <ListItemText
          className={classes.menuItemText}
          primary={name}
          inset={!Icon}
        />
      )}
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore sx={{ pt: "6px" }} />}
      {isExpandable && open && <IconExpandLess sx={{ pt: "6px" }} />}
    </AppMenuItemComponent>
  );

  const MenuItemChildren =
    isExpandable || !showText ? (
      <Collapse in={open || !showText} timeout="auto" unmountOnExit>
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
});

export default memo(AppMenuItem);
