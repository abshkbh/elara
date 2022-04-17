import React from 'react';
import Login from './Login.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoAnnotator from './VideoAnnotator.js';

// The parent component for the app.
class App extends React.Component {
  render() {
    return (
      // The app has the following Routes -
      //
      // / - Login component.
      // /list/existing/<video_id>: For e.g. for this Youtube URL https://www.youtube.com/watch?v=TcAAARgLZ8M the video id will be "TcAAARgLZ8M". Each video  will be loaded at this route.
      < div className="App" >
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/list/existing/:video_id" element={<VideoAnnotator />} />
          </Routes>
        </BrowserRouter>
      </div >
    );
  }
}

export default App;