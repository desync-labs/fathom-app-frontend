export const customStyles = {
  control: (styles: any) => ({
    ...styles,
    borderRadius: 20,
    backgroundColor: "white",
    color: "#6C7284",
    maxHeight: "32px",
    margin: 0,
    padding: 0,
    border: "none",
    boxShadow: "none",
    ":hover": {
      cursor: "pointer",
      overflow: "hidden",
    },
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: "#6C7284",
  }),
  input: (styles: any) => ({
    ...styles,
    color: "#6C7284",
    overflow: "hidden",
  }),
  menu: (styles: any) => ({
    ...styles,
    borderRadius: 16,
    boxShadow:
      "0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon)",
    overflow: "hidden",
    padding: 0,
  }),
};

export const customStylesMobile = {
  control: (styles: any) => ({
    ...styles,
    borderRadius: 12,
    backgroundColor: "white",
    color: "#6C7284",
    maxHeight: "32px",
    margin: 0,
    padding: 0,
    boxShadow: "none",
    ":hover": {
      cursor: "pointer",
    },
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: "#6C7284",
  }),
  input: (styles: any) => ({
    ...styles,
    color: "6C7284",
    overflow: "hidden",
  }),
  menu: (styles: any) => ({
    ...styles,
    borderRadius: 20,
    boxShadow:
      "0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon)",
    overflow: "hidden",
    paddingBottom: "12px",
  }),
};

export const customStylesTime = {
  control: (styles: any) => ({
    ...styles,
    borderRadius: 20,
    backgroundColor: "white",
    color: "#6C7284",
    maxHeight: "32px",
    margin: 0,
    padding: 0,
    border: "none",
    boxShadow: "none",
    ":hover": {
      cursor: "pointer",
    },
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: "#6C7284",
  }),
  input: (styles: any) => ({
    ...styles,
    color: "transparent",
  }),
  menu: (styles: any) => ({
    ...styles,
    borderRadius: 16,
    boxShadow:
      "0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon)",
    overflow: "hidden",
    padding: 0,
  }),
};

export default customStyles;
