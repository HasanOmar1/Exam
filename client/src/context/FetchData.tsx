import axios from "axios";
import { createContext, useEffect, useState } from "react";
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
  isServerLoading: boolean;
};

export const FetchDataContext = createContext<null | FetchDataContextValues>(
  null
);

const FetchDataProvider = ({ children }: FetchDataProps) => {
  const [data, setData] = useState<DataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isServerLoading, setIsServerLoading] = useState<boolean>(true);

  useEffect(() => {
    wakeUpTheServer();
  }, []);

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

  const wakeUpTheServer = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/`);
      setIsServerLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FetchDataContext.Provider
      value={{
        data,
        fetchData,
        loading,
        errorMsg,
        setErrorMsg,
        isServerLoading,
      }}
    >
      {children}
    </FetchDataContext.Provider>
  );
};

export default FetchDataProvider;
