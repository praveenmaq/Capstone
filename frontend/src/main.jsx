
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Finds the HTML element with id "root" and renders the App component inside it, starting your React application
createRoot(document.getElementById("root")).render(<App />);
