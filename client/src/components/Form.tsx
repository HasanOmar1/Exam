import { useEffect, useRef, useState } from "react";
import { useFetchDataContext } from "../context/FetchData";
import { isURL } from "../utils/isURL";

const Form = () => {
  const { fetchData, loading, errorMsg, setErrorMsg } = useFetchDataContext();
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

    if (
      isURL(inputsValues.firstInputValue) &&
      isURL(inputsValues.secondInputValue) &&
      isURL(inputsValues.thirdInputValue)
    ) {
      fetchData(
        `urls=${inputsValues.firstInputValue}&urls=${inputsValues.secondInputValue}&urls=${inputsValues.thirdInputValue}`
      );

      setInputsValues({
        firstInputValue: "",
        secondInputValue: "",
        thirdInputValue: "",
      });
    } else {
      setErrorMsg("Please provide valid URLs");
    }
  }

  return (
    <section>
      <div className="title-container">
        <h1>
          Welcome to the <span className="important">Meta-Data</span> scrapper
          using puppeteer
        </h1>
        <h3>Enter the URLs you want to scrape</h3>
        {<p id="error-msg">{errorMsg}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          required
          type="url"
          placeholder="Enter a valid URL"
          value={inputsValues?.firstInputValue}
          onChange={(e) => handleInputChange(e, "firstInputValue")}
          disabled={loading}
        />
        <input
          required
          type="url"
          placeholder="Enter a valid URL"
          value={inputsValues?.secondInputValue}
          onChange={(e) => handleInputChange(e, "secondInputValue")}
          disabled={loading}
        />
        <input
          required
          type="url"
          placeholder="Enter a valid URL"
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
