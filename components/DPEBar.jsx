import React from "react";

const DPE_COLORS = {
  A: "#00b050",
  B: "#92d050",
  C: "#ffff00",
  D: "#ffc000",
  E: "#ff6600",
  F: "#ff0000",
  G: "#a80000",
};

const DPEBar = ({ lettre }) => {
  const lettres = ["A", "B", "C", "D", "E", "F", "G"];

  return (
    <div className="space-y-1">
      {lettres.map((l) => (
        <div
          key={l}
          className={`flex items-center text-white font-bold text-sm rounded-l-full overflow-hidden ${
            l === lettre?.toUpperCase() ? "ring-2 ring-black" : ""
          }`}
        >
          <div
            style={{
              backgroundColor: DPE_COLORS[l],
              width: `${120 + lettres.indexOf(l) * 15}px`,
              padding: "0.3rem 0.6rem",
            }}
            className="flex justify-between items-center"
          >
            <span>{l}</span>
            <span className="ml-2 text-white text-xs">
              {getPlageConso(l)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const getPlageConso = (lettre) => {
  switch (lettre) {
    case "A":
      return "≤ 50";
    case "B":
      return "51 à 90";
    case "C":
      return "91 à 150";
    case "D":
      return "151 à 230";
    case "E":
      return "231 à 330";
    case "F":
      return "331 à 450";
    case "G":
      return "> 450";
    default:
      return "";
  }
};

export default DPEBar;
