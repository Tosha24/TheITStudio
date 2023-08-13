import { BrowserRouter , Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Table from "./pages/Table";

function App() {
  return (
    // <Table/>
    // <div className='w-screen h-screen overflow-x-hidden overflow-y-scroll'>
    //   <Form/>
    // </div>
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Table/>} />
        <Route path='/form' element={<Form/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
