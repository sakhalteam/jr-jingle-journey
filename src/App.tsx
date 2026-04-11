import { Routes, Route } from "react-router-dom";
import HomeBtn from "./components/HomeBtn";
import Landing from "./pages/Landing";
import RideMode from "./pages/RideMode";

export default function App() {
  return (
    <>
      <HomeBtn />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ride" element={<RideMode />} />
      </Routes>
    </>
  );
}
