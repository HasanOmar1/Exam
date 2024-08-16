import { useState } from "react";
import Inputs from "./Inputs";

const Form = () => {
  const [numOfInputs, setNumOfInputs] = useState(5);

  const arrOfNums = [];

  for (let i = 0; i < numOfInputs; i++) {
    arrOfNums.push(i);
  }

  console.log(arrOfNums);

  return (
    <section>
      <h1>Choose How many inputs you want</h1>
      <form>
        {arrOfNums.map((_, i) => {
          return <Inputs key={i} />;
        })}
      </form>
    </section>
  );
};

export default Form;
