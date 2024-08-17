import { useEffect, useRef, useState } from "react";
import { useFetchDataContext } from "../context/FetchData";

const Form = () => {
  const { fetchData, loading } = useFetchDataContext();
  const [inputsValues, setInputsValues] = useState({
    firstInputValue: "",
    secondInputValue: "",
    thirdInputValue: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: string
  ) => {
    setInputsValues((prev) => ({ ...prev, [input]: e.target.value }));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchData(
      `urls=${inputsValues.firstInputValue}&urls=${inputsValues.secondInputValue}&urls=${inputsValues.thirdInputValue}`
    );

    setInputsValues({
      firstInputValue: "",
      secondInputValue: "",
      thirdInputValue: "",
    });
  }

  return (
    <section>
      <div className="title-container">
        <h1>Welcome to meta data scrapper using puppeteer</h1>
        <h3>Enter the URLs you want to scrap</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          required
          type="url"
          placeholder="URL"
          value={inputsValues?.firstInputValue}
          onChange={(e) => handleInputChange(e, "firstInputValue")}
          disabled={loading}
        />
        <input
          required
          type="url"
          placeholder="URL"
          value={inputsValues?.secondInputValue}
          onChange={(e) => handleInputChange(e, "secondInputValue")}
          disabled={loading}
        />
        <input
          required
          type="url"
          placeholder="URL"
          value={inputsValues?.thirdInputValue}
          onChange={(e) => handleInputChange(e, "thirdInputValue")}
          disabled={loading}
        />

        <button type="submit" title="Click to fetch data" disabled={loading}>
          Fetch Data
        </button>
      </form>
    </section>
  );
};

export default Form;
