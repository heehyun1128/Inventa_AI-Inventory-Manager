import { ImageUploader } from "@/components/ImageUploader";
import React from "react";

const Search: React.FC = () => {
  return (
    <div className="search-container" style={{display:"flex",flexDirection:"column",alignContent:"center",width:"90vw",height:"90vh",alignItems:"center"}}>
      <h2 className="text-focus-in">Looking for Something Specific in Your Inventory?</h2>
      <p className="text-focus-in">Upload a Picture Below and Let Inventa AI Agent Help You</p>
      <ImageUploader />
    </div>
  );
};

export default Search;
