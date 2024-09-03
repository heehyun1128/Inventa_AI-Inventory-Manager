"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { addItem } from "@/lib/actions/item.actions";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { parsePicDescription, renderParsedDescription } from "@/lib/helper";

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
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    {/* inventory successfully updated - render success alert */}
      {successAlert && (
        <div
          style={{
            height: "40vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Successfully updated inventory!
          </Alert>
          
          <Button
            style={{
              cursor: "pointer",
              backgroundColor: "black",
              padding: "12px",
              height: "30px",
              color: "white",
              margin: "30px",
            }}
            onClick={() => {
              setSuccessAlert(false);
              setPicDescription("")
              setQty("")
              setImage("")
              setFile(null)
            }}
          >
            Adding another item?
          </Button>
        </div>
      )}

      {/* upload image */}
      {!successAlert && (
        <div
          className="image-uploader-container text-focus-in "
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              height: "fit-content",
              minHeight: "50vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              // border:"1px dotted #536493",
              minWidth: "45%",
              borderRadius: "1rem",
              padding: "10px",
            }}
          >
            <input
              style={{
                display: "none",
              }}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="customFileInput"
            />
            {/* customized image upload button  */}
            <button
              onClick={() => {
                setPicDescription("");
                document.getElementById("customFileInput")?.click();
              }}
              style={{
                height: "40px",
                backgroundColor: "#536493",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Choose File
            </button>
            <span id="fileName" style={{ marginTop: "10px" }}>
              No file chosen
            </span>
            {/* if image is uploaded - render image */}
            {image && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40vw",
                }}
              >
                <Image
                  src={image as string}
                  alt="Preview"
                  width={200}
                  height={300}
                  style={{
                    marginBottom: "20px",
                    maxWidth: "26vw",
                    height: "auto",
                  }}
                  layout="responsive"
                />

                {loading ? (
                  <CircularProgress style={{ marginTop: "20px" }} />
                ) : (
                  // image done uploading, submit image for AI object recognition
                  <Button
                    variant="contained"
                    className="submit-img-btn"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#536493",
                      padding: "12px",
                      color: "white",
                      height: "40px",
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
                {renderParsedDescription(
                  parsePicDescription(picDescription)
                ) !== "No Sku found. Please try again." ? (
                  // sku is found in image - update inventory with quantity input
                  <div
                    style={{
                      height: "fit-content",
                      padding: "20px",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
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
                    <p style={{ marginBottom: "16px" }}>
                      Add Item to Inventory?
                    </p>
                    {/* button to confirm adding item to inventory */}
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
                        // router.push("/inventory");
                        setSuccessAlert(true);
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                ) : (
                  <p style={{ color: "#536493" }}>
                    {picDescription &&
                      renderParsedDescription(
                        parsePicDescription(picDescription)
                      )}
                  </p>
                )}
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
      )}
    </>
  );
};

export default ImageUploader;
