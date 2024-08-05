"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

export const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [picDescription, setPicDescription] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
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

  return (
    <div className="image-uploader-container">
      <div style={{ display: "flex", flexDirection:"column",justifyContent: "center",alignItems:"center",}}>
        <input
         style={{height:"40px"}}
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
              height={550}
              style={{marginBottom:"20px"}}
            />
            <button className="submit-img-btn" onClick={handleSubmit}>Submit Image</button>
          </div>
        )}
      </div>
      {picDescription !== "" ? (
        <div style={{ width: "30vw",display: "flex", justifyContent: "center",alignItems:"center" }}>
          <div style={{height:"20vh",padding:"20px"}}>{JSON.stringify(picDescription, null, 2)}</div>
        </div>
      ) : (
        <div style={{ width: "30vw",height:"100px",display: "flex", justifyContent: "center",alignContent:"center" }}></div>
      )}
    </div>
  );
};

export default ImageUploader;
