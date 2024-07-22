import { SyntheticEvent, useEffect, useState } from "react";
import { ICollateralPool } from "fathom-sdk";

interface PriceData {
  "1m": number | null;
  "2m": number | null;
  "3m": number | null;
  "6m": number | null;
}

const useOpenPositionAiAssist = (pool: ICollateralPool) => {
  const [isAiSuggestionOpen, setIsAiSuggestionOpen] = useState<string | false>(
    false
  );
  const [range, setRange] = useState<number>(30);
  const [pricesPrediction, setPricesPrediction] = useState<PriceData>({
    "1m": null,
    "2m": null,
    "3m": null,
    "6m": null,
  });
  const [minPricePrediction, setMinPricePrediction] = useState<number | null>(
    null
  );
  const [predictionLiquidation, setPredictionLiquidation] = useState<
    number | null
  >(null);
  const [loadingPricePrediction, setLoadingPricePrediction] =
    useState<boolean>(false);

  useEffect(() => {
    console.log("pool", pool);
    const fetchDataPricePrediction = async () => {
      setLoadingPricePrediction(true);

      try {
        const baseUrl = process.env.REACT_APP_PRICE_PREDICTION_URL;
        const periods = ["1m", "2m", "3m", "6m"];
        const endpoints = periods.map(
          (period) =>
            `${baseUrl}/get-${pool.poolName.toLowerCase()}-price-${period}`
        );

        console.log("endpoints", endpoints);

        const responses = await Promise.all(
          endpoints.map((endpoint) => fetch(endpoint))
        );

        console.log("responses", responses);

        const data = await Promise.all(
          responses.map((response) => {
            console.log("response", response);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${response.url}`);
            }
            return response.json();
          })
        );

        const newPrices: PriceData = {
          "1m": data[0],
          "2m": data[1],
          "3m": data[2],
          "6m": data[3],
        };

        const values = Object.values(newPrices).filter(
          (value): value is number => value !== null
        );
        const min = Math.min(...values);

        setPricesPrediction(newPrices);
        setMinPricePrediction(min);
      } catch (err) {
        console.error("Failed to fetch price prediction data", err);
      } finally {
        setLoadingPricePrediction(false);
      }
    };

    fetchDataPricePrediction();
  }, [pool.poolName]);

  useEffect(() => {
    if (minPricePrediction) {
      setPredictionLiquidation(minPricePrediction);
    }
  }, [minPricePrediction, loadingPricePrediction]);

  const handleChangeRange = (range: number) => {
    setRange(range);
  };

  const handleAiSuggestionOpen =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setIsAiSuggestionOpen(isExpanded ? panel : false);
    };

  return {
    isAiSuggestionOpen,
    range,
    loadingPricePrediction,
    pricesPrediction,
    minPricePrediction,
    predictionLiquidation,
    handleChangeRange,
    handleAiSuggestionOpen,
  };
};

export default useOpenPositionAiAssist;
