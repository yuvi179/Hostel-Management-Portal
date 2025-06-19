import Page3 from "./components/Page3";
import Login from "./components/Login/Login";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page7 from "./components/Page7";
import Page8 from "./components/Page8";
import Page9 from "./components/Page9";
import Page10 from "./components/Page10";
import Page4 from './components/Page4';
import Page5 from './components/Page5';
import Page6 from './components/Page6';

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Edit from "./components/Edit/Edit";

function App() {
  return (
    <Routes>
      <Route path="/edit" element={<Edit />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/page3" element={<Page3 />} />
      <Route path="/page2" element={<Page2 />} />
      <Route path="/page7" element={<Page7 />} />
      <Route path="/page8" element={<Page8 />} />
      <Route path="/page9" element={<Page9 />} />
      <Route path="/page10" element={<Page10 />} />
      <Route path="/page4" element={<Page4 />} />
      <Route path="/page5" element={<Page5 />} />
      <Route path="/page6" element={<Page6 />} />
    </Routes>
  );
}

export default App;
