import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Furnitures = () => {
  return (
    <GridProductCategory
      categoryName="furnitures"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Furnitures;
