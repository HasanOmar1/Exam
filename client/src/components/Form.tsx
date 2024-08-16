import { useState } from "react";
import Inputs from "./Inputs";

const Form = () => {
  const [numOfInputs, setNumOfInputs] = useState<number>(3);

  const arrOfNums = [];

  for (let i = 0; i < numOfInputs; i++) {
    arrOfNums.push(i);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section>
      <h1>Choose How many inputs you want</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={numOfInputs}
          onChange={(e) => setNumOfInputs(+e.target.value)}
          name="numOfInput"
          id="numOfInput"
        >
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        {arrOfNums.map((n) => (
          <Inputs key={n} />
        ))}

        <button type="submit" title="Click to fetch data">
          Fetch Data
        </button>
      </form>
    </section>
  );
};

export default Form;
