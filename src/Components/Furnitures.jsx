import React from "react";
import GridProductCategory from "./GridProductCategory";
import FurnituresSidebarFilter from "./FurnituresSidebarFilter";

const Furnitures = () => {
  return (
    <GridProductCategory
      categoryName="furnitures"
      SidebarFilterComponent={FurnituresSidebarFilter}
    />
  );
};

export default Furnitures;
