import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const Card = ({ title }) => {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
};

const App = () => {
  return (
    <div className="card-container">
      <Card title="Movie 1" /> <Card title="Movie 2" /> <Card title="Movie 3" />
    </div>
  );
};

export default App;
