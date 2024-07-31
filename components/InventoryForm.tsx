import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { addItem } from "@/lib/actions/item.actions";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/app/firebase";

export interface CreateItemInterface {
  name: string;
  sku: string;
  quantity: string;
  price: string;
  location: string;
}
export const InventoryForm: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    
  const [formData, setFormData] = useState<CreateItemInterface>({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    location: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    await addItem(formData)
  };

  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <TextField
            label="Item Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="SKU"
            variant="outlined"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quantity"
            variant="outlined"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <TextField
            label="Location"
            variant="outlined"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </Box>
  );
};

export default InventoryForm;
