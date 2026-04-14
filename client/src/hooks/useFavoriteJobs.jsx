// allows for useFavoriteJob to be used in other files

import { useContext } from "react";
import { FavoriteJobContext } from "../contexts/FavoriteJobContext";

// export the context for use as a hook 
const useFavoriteJobs = () => {
  const favJobs = useContext(FavoriteJobContext);

  return favJobs;
}

export default useFavoriteJobs;