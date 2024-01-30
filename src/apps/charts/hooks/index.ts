import { useState, useCallback, useEffect, useRef } from "react";
import { shade } from "polished";
import Vibrant from "node-vibrant";
import { hex } from "wcag-contrast";
import { isAddress } from "apps/charts/utils";
import copy from "copy-to-clipboard";

export function useColor(tokenAddress: any) {
  const [color, setColor] = useState("#2172E5");
  if (tokenAddress) {
    const path = `https://raw.githubusercontent.com/Into-the-Fathom/assets/master/blockchains/xinfin/${isAddress(
      tokenAddress
    )}/logo.png`;
    if (path) {
      Vibrant.from(path).getPalette((err, palette) => {
        if (palette && palette.Vibrant) {
          let detectedHex = palette.Vibrant.hex;
          let AAscore = hex(detectedHex, "#FFF");
          while (AAscore < 3) {
            detectedHex = shade(0.005, detectedHex);
            AAscore = hex(detectedHex, "#FFF");
          }
          setColor(detectedHex);
        }
      });
    }
  }
  return color;
}

type UseCopyClipboardReturnType = [boolean, (text: string) => void];

export const useCopyClipboard = (timeout = 500): UseCopyClipboardReturnType => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const staticCopy = useCallback((text: string) => {
    const didCopy = copy(text);
    setIsCopied(didCopy);
  }, []);

  useEffect(() => {
    let hide: ReturnType<typeof setTimeout>;
    if (isCopied) {
      hide = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }

    return () => {
      hide && clearTimeout(hide);
    };
  }, [isCopied, setIsCopied, timeout]);

  return [isCopied, staticCopy];
};

export default function useInterval(
  callback: () => void,
  delay: null | number
) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const current = savedCallback.current;
      current && current();
    }

    if (delay !== null) {
      tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
}
