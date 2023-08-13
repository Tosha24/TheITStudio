import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const CustomForm = ({ show, handleClose, item}) => {
  const [formData, setFormData] = useState({
    name: item?.name,
    email: item?.email,
    phone: item?.phone,
    hobbies: item?.hobbies,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    hobbies: '',
  });

  const saveData = async() => {
    console.log("Saving data");
    const response = await fetch('https://the-it-studio.onrender.com/api/save-form', {
      method: "POST", 
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if(response.ok) {
      toast.success('Form saved successfully', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      handleClose();
    }
  }

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
      valid = false;
    }

    if (!formData.hobbies) {
      newErrors.hobbies = 'Hobbies are required';
      valid = false;
    }

    setErrors(newErrors);
    if(valid) saveData();
    return valid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const updateForm = async() => {
    try{
      const response = await fetch('https://the-it-studio.onrender.com/api/update-form', {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({...formData, id: item?._id}),
      });
      console.log(response);
      if(response.ok){
        toast.success('Form updated successfully', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
        handleClose();
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name" className="mt-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="phone" className="mt-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="hobbies" className="mt-2">
              <Form.Label>Hobbies (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                isInvalid={!!errors.hobbies}
              />
              <Form.Control.Feedback type="invalid">{errors.hobbies}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose} className='mx-2 bg-pink-500 p-2 rounded-lg tracking-wider text-white font-bold'>
            Close
          </button>
          <button onClick={item ? updateForm : validateForm} className='mx-2 bg-pink-500 p-2 rounded-lg tracking-wider text-white font-bold'>
            {item ? "Update" : "Save"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomForm;
