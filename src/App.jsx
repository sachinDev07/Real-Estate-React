import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import Toast from "./components/Toast";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Toast />
    </>
  );
}

export default App;
