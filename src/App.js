import React from 'react';
import Login from './Login.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoAnnotator from './VideoAnnotator.js';


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/list/existing/:video_id" element={<VideoAnnotator />} />
          </Routes>
        </BrowserRouter>
      </div >
    );
  }
}

export default App;