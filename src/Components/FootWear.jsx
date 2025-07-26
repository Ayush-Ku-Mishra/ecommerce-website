import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Footwear = () => {
  return (
    <GridProductCategory
      categoryName="footwear"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Footwear;
