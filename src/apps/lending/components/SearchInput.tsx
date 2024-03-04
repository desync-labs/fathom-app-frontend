import { SearchIcon } from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";
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

  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));

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
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: 1,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "6px",
        height: "36px",
        ...wrapperSx,
      })}
    >
      <Box sx={{ ml: 1, mt: 0.5 }}>
        <SearchIcon color="#c5d7f2" height={16} />
      </Box>
      <InputBase
        autoFocus={sm}
        inputRef={inputEl}
        sx={{ width: "100%", fontSize: { xs: 16, sm: 14 } }}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          debounchedChangeHandler(e.target.value);
        }}
      />
      <IconButton
        sx={{ p: 0, mr: 1, visibility: searchTerm ? "visible" : "hidden" }}
        onClick={() => handleClear()}
      >
        <XCircleIcon height={16} />
      </IconButton>
    </Box>
  );
};
