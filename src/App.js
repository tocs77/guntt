import React from "react";
import "./App.css";

import Diagramm from "./Components/Diagram/Diagram";
import Navigation from "./Components/UI/Navigation/Navigation";
import SideMenu from "./Components/UI/SideMenu/SideMenu";
import StatusBar from './Components/UI/StatusBar/StatusBar'

function App() {
  return (
    <React.Fragment>
      <Navigation />
      <SideMenu />
      <Diagramm />
      <StatusBar />
    </React.Fragment>
  );
}

export default App;
