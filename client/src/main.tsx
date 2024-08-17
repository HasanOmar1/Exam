import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import FetchDataProvider from "./context/FetchData.tsx";

createRoot(document.getElementById("root")!).render(
  <FetchDataProvider>
    <App />
  </FetchDataProvider>
);
