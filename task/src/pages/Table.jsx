import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import Select from "react-select";
import Form from "./Form";
import { toast } from "react-toastify";


const Table = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);

  const [currItem, setCurrItem] = useState({});

  const [selectedItems, setSelectedItems] = useState([]);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://the-it-studio.onrender.com/api/get-items");
      const respArray = await response.json();
      setData(respArray);
    };

    fetchData();
  }, [data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (selectedOption) => {
    setItemsPerPage(selectedOption.value);
    setCurrentPage(1);
  };

  const addNewData = () => {
    setCurrItem(null);
    setOpenForm(true);
  };

  const selectThisItem = (e, item) => {
    if(e.target.checked){
      setDisabled(false);
      setSelectedItems([...selectedItems, item]);
    }
    else{
      setSelectedItems(selectedItems.filter(i => i._id !== item._id));
      if(selectedItems.length === 1){
        setDisabled(true);
      }
    }
  }

  const getItem = async (id) => {
    const response = await fetch("https://the-it-studio.onrender.com/api/get-item", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const respArray = await response.json();
    console.log(respArray);
    setCurrItem(respArray);
    setOpenForm(true);
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`https://the-it-studio.onrender.com/api/delete-item`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if(response.ok){
        toast.success('Item deleted', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.log(error + "api not called");
    }
  };

  const sendEmail = async() => {
    try{
      const response = await fetch('https://the-it-studio.onrender.com/api/send-email', {
        method: "POST",
        headers:{
          "Content-type": "application/json",
        },
        body: JSON.stringify(selectedItems),
      });

      if(response.ok){
        toast.success("Email sent successfully", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      else{
        toast.error("Email not sent", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div
      className="container mx-auto sm:px-8 max-w-3xl
         sm:m-8 bg-white/40 rounded-lg shadow-xl p-4 sm:p-8"
    >
      <table className="rounded-lg">
        <thead className="text-center">
          <tr className="border-b-2 border-gray-500">
            <th className="py-3 px-4">Select</th>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Contact</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentItems?.map((item, index) => (
            <tr
              className="border-b-2 border-gray-300 rounded-lg 
            hover:bg-pink-200/50 cursor-pointer transition-all duration-100 ease-in-out hover:text-black hover:font-bold hover:shadow-xl hover:rounded-lg hover:border-transparent hover:bg-opacity-85"
              key={index}
            >
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  onChange={(e) => selectThisItem(e, item)}
                />
              </td>
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{item?.name}</td>
              <td className="py-3 px-4">{item?.email}</td>
              <td className="py-3 px-4">{item?.phone}</td>
              <td className="py-3 px-4">
                <button
                  className="mx-2 bg-pink-500 p-2 rounded-lg tracking-wider text-white font-bold"
                  onClick={() => getItem(item?._id)}
                >
                  Update
                </button>
                <button
                  className="mx-2 bg-rose-500 p-2 rounded-lg tracking-wider text-white font-bold"
                  onClick={() => deleteItem(item?._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {currentItems?.length === 0 && (<tr> 
              <td colspan="6" className='text-xl'> No Items</td>
             </tr>)}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={addNewData}
        >
          Add New Data
        </button>
        <button className={`${disabled && "bg-blue-500/50 cursor-not-allowed hover:bg-blue-500/50"} bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2`} onClick={sendEmail} disabled={disabled}>
          Send
        </button>
      </div>
      <div className="mt-4 d-flex justify-content-between">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: Math.ceil(data?.length / itemsPerPage) }).map(
            (item, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(data?.length / itemsPerPage)}
          />
        </Pagination>
        <Select
          name="itemsPerPage"
          value={itemsPerPage}
          options={[
            { value: 10, label: "10" },
            { value: 25, label: "25" },
            { value: 50, label: "50" },
          ]}
          onChange={handleItemsPerPageChange}
        />
      </div>
      {openForm && (
        <Form
          show={openForm}
          handleClose={() => setOpenForm(false)}
          item={currItem}
        />
      )}
    </div>
  );
};

export default Table;
