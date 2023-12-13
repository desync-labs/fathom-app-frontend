interface BasicData {
  token0?: {
    id: string;
    name: string;
    symbol: string;
  };
  token1?: {
    id: string;
    name: string;
    symbol: string;
  };
}

// override tokens with incorrect symbol or names
export function updateNameData(data: BasicData): BasicData | undefined {
  return data;
}
