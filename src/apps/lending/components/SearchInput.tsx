import {
  Box,
  BoxProps,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import debounce from "lodash/debounce";
import { FC, useMemo, useRef, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";

interface SearchInputProps {
  onSearchTermChange: (value: string) => void;
  wrapperSx?: BoxProps;
  placeholder: string;
}

export const SearchInput: FC<SearchInputProps> = ({
  onSearchTermChange,
  wrapperSx,
  placeholder,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleClear = () => {
    setSearchTerm("");
    onSearchTermChange("");
    inputEl.current?.focus();
  };

  const debounchedChangeHandler = useMemo(() => {
    return debounce((value: string) => {
      onSearchTermChange(value);
    }, 300);
  }, [onSearchTermChange]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        background: "#091433",
        border:
          isFocused || isHovered ? "1px solid #5a81ff" : "1px solid #3d5580",
        borderRadius: "6px",
        height: "36px",
        boxShadow: isFocused || isHovered ? "0 0 8px #003cff" : "none",
        ...wrapperSx,
      }}
    >
      <Box sx={{ ml: 1, mt: 0.5 }}>
        <SearchIcon sx={{ color: "#9fadc6", height: 19, width: 19 }} />
      </Box>
      <InputBase
        autoFocus={sm}
        inputRef={inputEl}
        sx={{ width: "100%", color: "#8ea4cc", fontSize: { xs: 16, sm: 14 } }}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          debounchedChangeHandler(e.target.value);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <IconButton
        sx={{ p: 0, mr: 1, visibility: searchTerm ? "visible" : "hidden" }}
        onClick={() => handleClear()}
      >
        <CancelIcon sx={{ color: "#9fadc6", height: 16, width: 16 }} />
      </IconButton>
    </Box>
  );
};
