import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import { addItem, getItems } from "@/lib/actions/item.actions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";

export interface CreateItemInterface {
  name: string;
  sku: string;
  quantity: string;
  price: string;
  location: string;
}
export const InventoryForm: React.FC<{ fetchData: () => void }> = ({
  fetchData,
}) => {
  const [user, setUser] = useState<any>(null);
  const [isNoSKU, setIsNoSKU] = useState<Boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!formData.sku) {
      e.preventDefault();
      
      setIsNoSKU(true)
      return;
    }

    try {
      await addItem(formData);
      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: "",
        location: "",
      });
      setIsNoSKU(false)
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
       {isNoSKU && <Alert variant="filled" severity="error">
  This is a filled error Alert.
</Alert>}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <TextField
            label="Item Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            // required
            style={{ width: "14vw" }}
          />
          <TextField
            label="SKU"
            variant="outlined"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            style={{ width: "14vw" }}
          />
          <TextField
            label="Price"
            variant="outlined"
            name="price"
            value={formData.price}
            onChange={handleChange}
            // required
            style={{ width: "14vw" }}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            // required
            style={{ width: "14vw" }}
          />
          <TextField
            label="Location"
            variant="outlined"
            name="location"
            value={formData.location}
            onChange={handleChange}
            // required
            style={{ width: "14vw" }}
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
