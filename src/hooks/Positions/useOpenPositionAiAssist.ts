import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { ICollateralPool } from "fathom-sdk";
import useAlertAndTransactionContext from "context/alertAndTransaction";
import BigNumber from "bignumber.js";
import { DANGER_SAFETY_BUFFER } from "../../utils/Constants";

interface PriceData {
  "1m": number | null;
  "2m": number | null;
  "3m": number | null;
  "6m": number | null;
}

const useOpenPositionAiAssist = (
  pool: ICollateralPool,
  borrowInput: string,
  setAiPredictionCollateral: (value: string) => void
) => {
  const [isAiSuggestionOpen, setIsAiSuggestionOpen] = useState<string | false>(
    false
  );
  const [range, setRange] = useState<number>(30);

  const [loadingPricePrediction, setLoadingPricePrediction] =
    useState<boolean>(false);
  const [pricesPrediction, setPricesPrediction] = useState<PriceData>({
    "1m": null,
    "2m": null,
    "3m": null,
    "6m": null,
  });
  const [minPricePrediction, setMinPricePrediction] = useState<number | null>(
    null
  );
  const [recommendCollateralAmount, setRecommendCollateralAmount] = useState<
    string | null
  >(null);

  const { setShowErrorAlertHandler } = useAlertAndTransactionContext();

  useEffect(() => {
    fetchDataPricePrediction(pool.poolName.toLowerCase());
  }, [pool.poolName]);

  useEffect(() => {
    if (minPricePrediction && !loadingPricePrediction) {
      getLiquidationCollateralAmount(borrowInput);
    }
  }, [minPricePrediction, loadingPricePrediction, borrowInput]);

  useEffect(() => {
    let values: number[] = [];

    if (range <= 30) {
      if (pricesPrediction["1m"] !== null) values.push(pricesPrediction["1m"]);
    } else if (range <= 60) {
      if (pricesPrediction["1m"] !== null) values.push(pricesPrediction["1m"]);
      if (pricesPrediction["2m"] !== null) values.push(pricesPrediction["2m"]);
    } else if (range <= 90) {
      if (pricesPrediction["1m"] !== null) values.push(pricesPrediction["1m"]);
      if (pricesPrediction["2m"] !== null) values.push(pricesPrediction["2m"]);
      if (pricesPrediction["3m"] !== null) values.push(pricesPrediction["3m"]);
    } else {
      if (pricesPrediction["1m"] !== null) values.push(pricesPrediction["1m"]);
      if (pricesPrediction["2m"] !== null) values.push(pricesPrediction["2m"]);
      if (pricesPrediction["3m"] !== null) values.push(pricesPrediction["3m"]);
      if (pricesPrediction["6m"] !== null) values.push(pricesPrediction["6m"]);
    }

    values = values.filter((value): value is number => value !== null);

    if (values.length > 0) {
      const min = Math.min(...values);
      setMinPricePrediction(min);
    } else {
      setMinPricePrediction(null);
    }
  }, [pricesPrediction, range]);

  const fetchDataPricePrediction = async (poolName: string) => {
    setLoadingPricePrediction(true);

    try {
      const baseUrl = process.env.REACT_APP_PRICE_PREDICTION_URL;
      const periods = ["1m", "2m", "3m", "6m"];
      const endpoints = periods.map(
        (period) => `${baseUrl}/get-${poolName}-price-${period}`
      );

      const responses = await Promise.all(
        endpoints.map((endpoint) => fetch(endpoint))
      );

      const data = await Promise.all(
        responses.map((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${response.url}`);
          }
          return response.json();
        })
      );

      const newPrices: PriceData = {
        "1m": data[0].price,
        "2m": data[1].price,
        "3m": data[2].price,
        "6m": data[3].price,
      };

      setPricesPrediction(newPrices);
    } catch (err) {
      setShowErrorAlertHandler(true, "Failed to fetch price prediction data");
      console.error("Failed to fetch price prediction data", err);
    } finally {
      setLoadingPricePrediction(false);
    }
  };

  const getLiquidationCollateralAmount = useCallback(
    (borrowInput: string) => {
      if (!borrowInput) {
        setRecommendCollateralAmount("0");
        return;
      }

      const priceWithSafetyMargin = BigNumber(
        minPricePrediction as number
      ).dividedBy(pool.liquidationRatio);
      /**
       * SAFE MIN COLLATERAL
       */
      const safeMinCollateral = BigNumber(borrowInput)
        .dividedBy(
          BigNumber(priceWithSafetyMargin)
            .dividedBy(BigNumber(100).plus(DANGER_SAFETY_BUFFER * 100))
            .multipliedBy(100)
        )
        .toString();

      setRecommendCollateralAmount(safeMinCollateral);
    },
    [pool, setRecommendCollateralAmount, minPricePrediction]
  );

  const handleChangeRange = (range: number) => {
    setRange(range);
  };

  const handleAiSuggestionOpen =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setIsAiSuggestionOpen(isExpanded ? panel : false);
    };

  const handleApplyAiRecommendation = () => {
    setAiPredictionCollateral(
      recommendCollateralAmount === null ? "0" : recommendCollateralAmount
    );
    setIsAiSuggestionOpen(false);
  };

  return {
    isAiSuggestionOpen,
    range,
    loadingPricePrediction,
    pricesPrediction,
    minPricePrediction,
    recommendCollateralAmount,
    handleChangeRange,
    handleAiSuggestionOpen,
    handleApplyAiRecommendation,
  };
};

export default useOpenPositionAiAssist;
