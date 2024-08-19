import Data from "./components/Data";
import Form from "./components/Form";
import { useFetchDataContext } from "./hooks/useFetchDataContext";

function App() {
  const { data, loading, isServerLoading } = useFetchDataContext();

  if (isServerLoading) {
    return (
      <div className="sleep-msg">
        <h1>The Server is waking up...</h1>
        <img
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW9reHl4bGJpdWNwd3JqajU5MTJwMG1yd25xdTIxMnBoa2M3cXVrbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/Y0NhkIdyT3TVBDWLkG/giphy.gif"
          alt="drinking coffee gif"
        />
      </div>
    );
  }

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
