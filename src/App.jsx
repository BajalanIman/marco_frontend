import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ErrorBoundary from "../src/Component/ErrorBoundary/ErrorBoundary";
import Mainbody from "./Component/Body/Mainbody";
import Login from "./Component/NavigationBar/Login";
import SingUp from "./Component/NavigationBar/SingUp";
import Setting from "./Component/Body/Setting/Setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Mainbody />} />
        <Route path="/login" index element={<Login />} />
        <Route path="/singUp" index element={<SingUp />} />
        <Route path="/setting" index element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default function WrappedApp() {
  return import.meta.env.MODE === "development" ? (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  ) : (
    <App />
  );
}
