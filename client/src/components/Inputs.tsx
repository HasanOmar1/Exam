import { useState } from "react";

const Inputs = () => {
  const [inputValue, setInputValue] = useState("");
  console.log(inputValue);
  return (
    <input
      type="url"
      placeholder="URL"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default Inputs;
