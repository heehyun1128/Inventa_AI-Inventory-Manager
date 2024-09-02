import { ImageUploader } from "@/components/ImageUploader";
import React from "react";

const Search: React.FC = () => {
  return (
    <div
      className="search-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        width: "90vw",
        height: "90vh",
        alignItems: "center",
      }}
    >
      <h1 className="text-focus-in" style={{marginBottom:"16px"}}>Add Item to Inventory</h1>
      <p className="text-focus-in">
        Upload a Picture Below and Uppdate Your Inventory Instantly with Inventa
      </p>
      <ImageUploader />
    </div>
  );
};

export default Search;
