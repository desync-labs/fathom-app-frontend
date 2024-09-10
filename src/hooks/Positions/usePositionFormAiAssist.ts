import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { ICollateralPool } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { DANGER_SAFETY_BUFFER } from "utils/Constants";
import useAlertAndTransactionContext from "context/alertAndTransaction";

interface PriceData {
  "1m": number | null;
  "2m": number | null;
  "3m": number | null;
  "6m": number | null;
}

const PERIODS_RELATIONS = {
  "1m": 30,
  "2m": 60,
  "3m": 90,
  "6m": 180,
};

const usePositionFormAiAssist = (
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
    const values = [Number(pool.collateralPrice)];

    if (pricesPrediction["1m"] !== null) {
      values.push(pricesPrediction["1m"] as number);
    }
    if (range > PERIODS_RELATIONS["1m"] && pricesPrediction["2m"] !== null) {
      values.push(pricesPrediction["2m"] as number);
    }
    if (range > PERIODS_RELATIONS["2m"] && pricesPrediction["3m"] !== null) {
      values.push(pricesPrediction["3m"] as number);
    }
    if (range > PERIODS_RELATIONS["3m"] && pricesPrediction["6m"] !== null) {
      values.push(pricesPrediction["6m"] as number);
    }

    if (values.length) {
      const min = Math.min(...values);
      setMinPricePrediction(min);
    } else {
      setMinPricePrediction(null);
    }
  }, [pricesPrediction, range, pool]);

  const fetchDataPricePrediction = useCallback(
    async (poolName: string) => {
      setLoadingPricePrediction(true);

      try {
        const baseUrl = process.env.REACT_APP_PRICE_PREDICTION_URL;
        const endpoints = Object.keys(PERIODS_RELATIONS).map(
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
    },
    [setLoadingPricePrediction, setShowErrorAlertHandler, setPricesPrediction]
  );

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
      const collateral = BigNumber(borrowInput)
        .dividedBy(priceWithSafetyMargin.multipliedBy(1 - DANGER_SAFETY_BUFFER))
        .toString();

      setRecommendCollateralAmount(collateral);
    },
    [pool, setRecommendCollateralAmount, minPricePrediction]
  );

  const handleChangeRange = useCallback(
    (range: number) => {
      setRange(range);
    },
    [setRange]
  );

  const handleAiSuggestionOpen = useCallback(
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setIsAiSuggestionOpen(isExpanded ? panel : false);
    },
    [setIsAiSuggestionOpen]
  );

  const handleApplyAiRecommendation = useCallback(() => {
    setAiPredictionCollateral(
      !recommendCollateralAmount ? "0" : recommendCollateralAmount
    );
    setIsAiSuggestionOpen(false);
  }, [setIsAiSuggestionOpen, recommendCollateralAmount]);

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

export default usePositionFormAiAssist;
