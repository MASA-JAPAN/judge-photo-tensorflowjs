import React from "react";
import "./App.css";
import JudgePage from "./components/JudgePage.js";
import firebase from "firebase";
import { firebaseConfig } from "./config/config.js";

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <div className="App">
      <JudgePage />
    </div>
  );
}

export default App;
