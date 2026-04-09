import { Routes, Route } from "react-router-dom";
import HomeBtn from "./components/HomeBtn";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <>
      <HomeBtn />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  );
}
