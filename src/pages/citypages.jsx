import React from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";


const CityPage = () => {
  const { cityName } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Properties in {cityName.toUpperCase()}</h1>
      <p>Show properties related to this city here.</p>
    </div>
  );
};

export default CityPage;