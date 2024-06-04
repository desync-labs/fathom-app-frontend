import { useEffect, useState } from "react";

const useShowText = (open: boolean) => {
  const [showText, setShowText] = useState<boolean>(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (open) {
      timeout = setTimeout(() => {
        setShowText(open);
      }, 100);
    } else {
      setShowText(open);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [open, setShowText]);

  return {
    showText,
  };
};

export default useShowText;
