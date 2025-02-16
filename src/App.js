import { Route, Routes } from "react-router-dom";
import SignUpScreen from "./components/SignUpScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<HomeScreen/>}/>
        <Route path="/signup" element={<SignUpScreen/>}/>
        <Route path="/login" element={<LoginScreen/>}/>
        <Route path="/dashboard" element={<DashboardScreen/>}/>
      </Routes>
    </div>
  );
}

export default App;
