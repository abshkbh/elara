import React from 'react';
import Login from './Login.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div >
    );
  }
}

export default App;