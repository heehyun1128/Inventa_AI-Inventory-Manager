"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { addItem } from "@/lib/actions/item.actions";
import { Button,CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export const addToInventory = (picDescription: string, qty: string) => {
  const res: any = picDescription;
  console.log(picDescription);

  const cleanedRes = res?.object
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, "")
    .trim();
  const jsonObject = JSON.parse(cleanedRes);
  jsonObject["quantity"] = Number(qty);
  console.log(jsonObject);
  addItem(jsonObject);
};

export const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [picDescription, setPicDescription] = useState<string>("");
  const [qty, setQty] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); 

  const router = useRouter();

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
      setLoading(true);
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
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="image-uploader-container text-focus-in " style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
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
            {loading ? (  
              <CircularProgress style={{ marginTop: "20px" }} />
            ) : (
              <Button
                variant="contained"
                className="submit-img-btn"
                style={{
                  cursor: "pointer",
                  backgroundColor: "black",
                  padding: "12px",
                  color: "white",
                }}
                onClick={handleSubmit}
              >
                Submit Image
              </Button>
            )}
          </div>
        )}
      </div>
      <div>
        {picDescription !== "" ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "fit-content",
                padding: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h2 style={{ marginBottom: "16px" }}>
                Updating stock unit #
                {
                  JSON.parse(
                    (picDescription as any).object
                      .replace(/```json/g, "")
                      .replace(/```/g, "")
                      .replace(/\n/g, "")
                      .trim()
                  ).sku
                }
              </h2>
            </div>
            <h4 style={{ marginBottom: "16px" }}>Quantity</h4>
            <input
              style={{
                height: "40px",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "16px",
              }}
              type="text"
              placeholder="quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <p style={{ marginBottom: "16px" }}>Add Item to Inventory?</p>
            <Button
              style={{
                cursor: "pointer",
                backgroundColor: "black",
                padding: "12px",
                height: "30px",
                color: "white",
                marginBottom: "30px",
              }}
              onClick={() => {
                addToInventory(picDescription, qty);
                router.push("/inventory");
                

              }}
            >
              Confirm
            </Button>
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
    </div>
  );
};

export default ImageUploader;
