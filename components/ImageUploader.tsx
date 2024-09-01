"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { addItem } from "@/lib/actions/item.actions";

export const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [picDescription, setPicDescription] = useState<string>("");
  const [qty, setQty] = useState<string>("");


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (file && image) {
      const base64Image = (image as string).split(",")[1]; // Extract base64 data from data URL

      try {
        const response = await axios.post(
          "/api/image",
          { data: base64Image },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPicDescription(response.data);
        console.log("Response from API:", response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const addToInventory = () => {
    const res:any = picDescription;
    const cleanedRes = res.object
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\n/g, "")
      .trim();
      const jsonObject = JSON.parse(cleanedRes)
      jsonObject["quantity"]=Number(qty)
      console.log(jsonObject)
    addItem(jsonObject);
  };

  return (
    <div className="image-uploader-container text-focus-in ">
      <div
        style={{
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <input
          style={{ height: "40px" }}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {image && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={image as string}
              alt="Preview"
              width={300}
              height={400}
              style={{ marginBottom: "20px", width: "100%", height: "auto" }}
              layout="responsive"
            />
            <button
              className="submit-img-btn"
              style={{ cursor: "pointer" }}
              onClick={handleSubmit}
            >
              Submit Image
            </button>
          </div>
        )}
      </div>
      {picDescription !== "" ? (
        <div
          style={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ height: "20vh", padding: "20px" }}>
            {JSON.stringify(picDescription, null, 2)}
          </div>
          <p>Quantity</p>
          <input
            type="text"
            placeholder="quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <p>Add Item to Inventory?</p>
          <button onClick={addToInventory}>Confirm</button>
        </div>
      ) : (
        <div
          style={{
            width: "30vw",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        ></div>
      )}
    </div>
  );
};

export default ImageUploader;
