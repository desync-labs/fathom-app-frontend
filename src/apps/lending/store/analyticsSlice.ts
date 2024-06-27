import { StateCreator } from "zustand";
import ReactGA from "react-ga4";

import { RootStore } from "apps/lending/store/root";

export type TrackEventProperties = {
  [key: string]: string | number | boolean | Date | undefined;
};

export type TrackEventProps = {
  eventName: string;
  eventParams?: TrackEventProperties;
};

export type AnalyticsSlice = {
  trackEvent: (eventName: string, properties?: TrackEventProperties) => void;
};

export const createAnalyticsSlice: StateCreator<
  RootStore,
  [["zustand/subscribeWithSelector", never], ["zustand/devtools", never]],
  [],
  AnalyticsSlice
> = (set, get) => {
  return {
    trackEvent: (eventName: string, properties?: TrackEventProperties) => {
      const eventProperties = {
        ...properties,
        walletAddress: get().account,
        market: get().currentMarket,
        walletType: get().walletType,
      };

      try {
        return ReactGA.event(eventName, eventProperties);
      } catch (err) {
        console.log("something went wrong tracking event", err);
        return;
      }
    },
  };
};
