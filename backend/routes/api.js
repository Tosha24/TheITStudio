const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');


router.post('/save-form', async (req, res) => {
  try {
    const { name, email, phone, hobbies } = req.body;

    const newForm = new Form({
      name,
      email,
      phone,
      hobbies,
    });

    const savedForm = await newForm.save();

    res.status(201).json({
      message: 'Form created successfully',
      success: true,
      savedForm,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});


router.get('/get-items', async (req, res) => {
  try{
    const items = await Form.find();
    res.status(200).json(items);
  }catch(error){
    res.status(500).json({ error: error.message});
  }
});


router.post('/get-item', async (req, res) => {
  try{
    const { id } = req.body; 
    const item = await Form.findOne({_id: id});
    
    if(!item){
      res.status(404).json({ message: "Item not found"});
    }

    if(item){
      res.status(200).json(item);
    }

  }catch(error) {
    res.status(500).json({ error: error.message});
  }
});

router.post('/update-form', async(req, res) => {
  try{
    const { id, name, email, phone, hobbies } = req.body;
    const updatedItem = await Form.findByIdAndUpdate({_id: id}, {
      name,
      email,
      phone,
      hobbies,
    });

    if(updatedItem) {
      res.status(200).json({message: "Item updated successfully"});
    }
    else{
      res.status(404).json({ message: "Item not found"});
    }
  }catch(error) {
    res.status(500).json({ error: error.message});
  }
})

router.post('/delete-item', async(req, res) => {
  try{
    const { id } = req.body;
    console.log(id);
    const deletedItem = await Form.findByIdAndDelete({_id: id});
    console.log(deletedItem);

    if(deletedItem) {
      res.status(200).json({message: "Item deleted successfully"});
    }
    else{
      res.status(404).json({ message: "Item not found"});
    }

  }catch(error){
    res.status(500).json({ error: error.message});
  }
});


router.post('/send-email', async (req, res) => {
  const selectedItems = req.body;

  console.log("Type: ", typeof(selectedItems));
  console.log("Data: ", selectedItems);

  const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
      { id: 'name', title: 'Name'},
      { id: 'email', title: 'Email'},
      { id: 'phone', title: 'Phone'},
      { id: 'hobbies', title: 'Hobbies'},
    ],
  });

  csvWriter.writeRecords(selectedItems)
  .then(() => {
    console.log('CSV file created');
  })
  .catch((error) => {
    console.log("Error writing CSV file", error);
  })

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: 'toshapatel179@gmail.com',
    to: 'tk.patel.official@gmail.com',
    subject: 'Form CSV Data',
    text: 'P.F.A. CSV Data attached',
    attachments: [
      {
        filename: 'data.csv',
        path: './data.csv',
      },  
    ],
  };

  try{
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully'});
  }
  catch(error){
    res.status(500).json({ error: error.message});
  }
})


module.exports = router;