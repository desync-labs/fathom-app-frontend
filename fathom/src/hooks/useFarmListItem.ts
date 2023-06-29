import { useState } from "react";


const useFarmListItem = () => {
  const [extended, setExtended] = useState<boolean>(true);


  return {
    extended,
    setExtended,
  }
}

export default useFarmListItem;