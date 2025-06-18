import Page4 from "./components/SelectRoom";
import Login from "./components/Login/Login";
import Page1 from "./components/LoginPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Edit from "./components/Edit/Edit";

function App() {
  return (
    <Routes>
      <Route path="/edit" element={<Edit />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/page4" element={<Page4 />} />
    </Routes>
  );
}

export default App;
