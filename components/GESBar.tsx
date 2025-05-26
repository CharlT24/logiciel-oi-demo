import React from "react";

const GES_COLORS = {
  A: "#e7e1ea",
  B: "#d3bfe5",
  C: "#be9dde",
  D: "#a97bd7",
  E: "#9449cc",
  F: "#7e33b2",
  G: "#5d178f",
};

const GESBar = ({ lettre }) => {
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
              backgroundColor: GES_COLORS[l],
              width: `${120 + lettres.indexOf(l) * 15}px`,
              padding: "0.3rem 0.6rem",
            }}
            className="flex justify-between items-center"
          >
            <span>{l}</span>
            <span className="ml-2 text-white text-xs">
              {getPlageGES(l)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const getPlageGES = (lettre) => {
  switch (lettre) {
    case "A":
      return "≤ 5";
    case "B":
      return "6 à 10";
    case "C":
      return "11 à 20";
    case "D":
      return "21 à 35";
    case "E":
      return "36 à 55";
    case "F":
      return "56 à 80";
    case "G":
      return "> 80";
    default:
      return "";
  }
};

export default GESBar;
