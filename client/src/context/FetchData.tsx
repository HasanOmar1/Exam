import axios from "axios";
import { createContext, useContext, useState } from "react";
import { DataType } from "../types/dataTypes";

type FetchDataProps = {
  children: React.ReactNode;
};

type FetchDataContextValues = {
  data: DataType[] | null;
  fetchData: (urls: string) => Promise<void>;
  loading: boolean;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
};

const FetchDataContext = createContext<null | FetchDataContextValues>(null);

const FetchDataProvider = ({ children }: FetchDataProps) => {
  const [data, setData] = useState<DataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchData = async (urls: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/fetch-metadata?${urls}`
      );
      setData(data);
      console.log(data);
      setErrorMsg("");
    } catch (error) {
      console.log(error);
      setErrorMsg("Please provide valid URLs");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FetchDataContext.Provider
      value={{ data, fetchData, loading, errorMsg, setErrorMsg }}
    >
      {children}
    </FetchDataContext.Provider>
  );
};

export const useFetchDataContext = () => {
  const context = useContext(FetchDataContext);

  if (!context) {
    throw new Error("This component is not wrapped in FetchDataProvider");
  }
  return context;
};

export default FetchDataProvider;
