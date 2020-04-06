import React, { useReducer } from "react";
import "./App.css";

import Diagramm from "./Components/Diagram/Diagram";
import Navigation from "./Components/UI/Navigation/Navigation";
import SideMenu from "./Components/UI/SideMenu/SideMenu";
import StatusBar from "./Components/UI/StatusBar/StatusBar";

import { reducer, initialTasks, Context } from "./store/reducers";

function App() {
  const [tasks, dispatch] = useReducer(reducer, initialTasks);
  return (
    <Context.Provider value={{ tasks, dispatch }}>
      <Navigation id='navigation' />
      <SideMenu />
      <Diagramm />
      <StatusBar id='statusBar' />
    </Context.Provider>
  );
}

export default App;
