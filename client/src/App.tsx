import Data from "./components/Data";
import Form from "./components/Form";
import { useFetchDataContext } from "./context/FetchData";

function App() {
  const { data, loading } = useFetchDataContext();

  return (
    <main>
      <Form />
      {loading ? (
        <h1 className="loading">Fetching Data...</h1>
      ) : (
        <div className="data-container">
          {data?.map((info, i) => {
            return <Data key={i} {...info} />;
          })}
        </div>
      )}
    </main>
  );
}

export default App;
