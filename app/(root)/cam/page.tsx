"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useRouter } from "next/navigation";
import { Camera, CameraType } from "../../../components/Camera";

import Image from "next/image";
import axios from "axios";
import Modal from "@/components/Modal";
import { addToInventory } from "@/components/ImageUploader";
import { CircularProgress } from "@mui/material";
import "../../globals.css"

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  width: 20%;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }

  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(Button)`
  background: url("https://img.icons8.com/ios/50/000000/compact-camera.png");
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const TorchButton = styled(Button)`
  background: url("https://img.icons8.com/ios/50/000000/light.png");
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &.toggled {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChangeFacingCameraButton = styled(Button)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 40px;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  }
`;

const ImagePreview = styled.div<{ image: string | null }>`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : "")}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;

const FullScreenImagePreview = styled.div<{ image: string | null }>`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: black;
  ${({ image }) => (image ? `background-image:  url(${image});` : "")}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Cam = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const camera = useRef<CameraType>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );
  const [torchToggled, setTorchToggled] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [picDescription, setPicDescription] = useState<string>("");
  const [qty, setQty] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      setDevices(videoDevices);
    })();
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    if (image) {
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
        console.log(response.data);
        console.log("Response from API:", response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const parsePicDescription = (description: string) => {
    try {
      const jsonStr = (description as any).object
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .trim();

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const renderParsedDescription = (parsedDescription: any) => {
    if (parsedDescription?.error) return parsedDescription.error;
    return parsedDescription?.sku;
  };

  return (
    <Wrapper>
      {showImage ? (
        <FullScreenImagePreview
          image={image}
          onClick={() => {
            setShowImage(!showImage);
          }}
        />
      ) : (
        <Camera
          ref={camera}
          aspectRatio="cover"
          facingMode="environment"
          numberOfCamerasCallback={(i: any) => setNumberOfCameras(i)}
          videoSourceDeviceId={activeDeviceId}
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          videoReadyCallback={() => {
            console.log("Video feed ready.");
          }}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "14vh",
          }}
        >
          <h4
            style={{
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "22px",
            }}
          >
            Adding Item to Inventory
          </h4>
          {loading ? (
            <CircularProgress style={{ marginTop: "20px" }} />
          ) : (
            <>
              {renderParsedDescription(parsePicDescription(picDescription)) !==
              "No Sku found. Please try again." ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center", justifyContent:"center"}}>
                  Adding item with sku number of <p style={{ color: "#4682A9" }}>
                    {picDescription &&
                      renderParsedDescription(
                        parsePicDescription(picDescription)
                      )}
                  </p>
                  <input
                    type="text"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    style={{height:"40px",borderRadius:"6px", margin:"10px"}}
                  />

                  <button className="confirm-btn" onClick={() => addToInventory(picDescription, qty)}>
                    Confirm
                  </button>
                </div>
              ) : (
                <p style={{ color: "#4682A9" }}>
                  {picDescription &&
                    renderParsedDescription(
                      parsePicDescription(picDescription)
                    )}
                </p>
              )}
            </>
          )}
        </div>
      </Modal>

      <Control>
        <select
          onChange={(event) => {
            setActiveDeviceId(event.target.value);
          }}
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
        </select>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <ImagePreview
            image={image}
            onClick={() => {
              setShowImage(!showImage);
            }}
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
              <button className="save-image-btn">
                <a
                  href={image}
                  download="captured-image.jpg"
                  style={{ padding: "0", textDecoration: "none" }}
                >
                  Save Image
                </a>
              </button>
              <button
                className="save-image-btn"
                onClick={() => {
                  handleSubmit();
                  setIsModalOpen(true);
                }}
              >
                <a
                  href={image}
                  style={{ padding: "0", textDecoration: "none" }}
                >
                  Add Item To Inventory
                </a>
              </button>
            </div>
          )}
        </div>
        <TakePhotoButton
          onClick={async () => {
            if (camera.current) {
              const photo = camera.current.takePhoto();
              console.log(photo);
              setImage(photo as string);
            }
          }}
        />

        {camera.current?.torchSupported && (
          <TorchButton
            className={torchToggled ? "toggled" : ""}
            onClick={() => {
              if (camera.current) {
                setTorchToggled(camera.current.toggleTorch());
              }
            }}
          />
        )}
        <ChangeFacingCameraButton
          disabled={numberOfCameras <= 1}
          onClick={() => {
            if (camera.current) {
              const result = camera.current.switchCamera();
              console.log(result);
            }
          }}
        />
      </Control>
    </Wrapper>
  );
};

export default Cam;
