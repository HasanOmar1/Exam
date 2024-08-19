import { useContext } from "react";
import { FetchDataContext } from "../context/FetchData";

export const useFetchDataContext = () => {
  const context = useContext(FetchDataContext);

  if (!context) {
    throw new Error("This component is not wrapped in FetchDataProvider");
  }
  return context;
};
