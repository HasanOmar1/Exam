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
};

const FetchDataContext = createContext<null | FetchDataContextValues>(null);

const FetchDataProvider = ({ children }: FetchDataProps) => {
  const [data, setData] = useState<DataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (urls: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/fetch-metadata?${urls}`
      );
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(`Error fetching data : `, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FetchDataContext.Provider value={{ data, fetchData, loading }}>
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
