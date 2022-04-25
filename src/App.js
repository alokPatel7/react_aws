import logo from "./logo.svg";
import "./App.css";
import Chat from "./Chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
