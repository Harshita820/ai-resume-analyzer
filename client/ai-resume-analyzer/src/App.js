import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import ResumeScreen from "./components/ResumeScreen";
import "./App.css";

function App() {
  const [mode, setMode] = useState(""); 

  return (
    <div className="container">
      {!mode && <HomeScreen setMode = {setMode}/>}
      {mode && <ResumeScreen mode = {mode} setMode = {setMode}/>}
    </div>
  );
}

export default App;