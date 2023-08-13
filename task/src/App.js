import { BrowserRouter , Route, Routes } from "react-router-dom";
import Table from "./pages/Table";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Table/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
