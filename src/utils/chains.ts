const SUBGRAPH_URLS = {
  50: "https://xinfin-graph.fathom.fi",
  51: "https://dev-graph.fathom.fi",
  11155111: "https://graph.sepolia.fathom.fi",
};

let DEFAULT_CHAIN_SUBGRAPH = "51";

if (process.env.REACT_APP_ENV === "prod") {
  DEFAULT_CHAIN_SUBGRAPH = "50";
}

export { SUBGRAPH_URLS, DEFAULT_CHAIN_SUBGRAPH };
