import { useLayoutEffect, useState } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth !== size[0] || window.innerHeight !== size[1]) {
        setSize([window.innerWidth, window.innerHeight]);
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [size, setSize]);

  return size;
};

export default useWindowSize;
