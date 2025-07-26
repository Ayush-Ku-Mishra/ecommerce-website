import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Bags = () => {
  return (
    <GridProductCategory
      categoryName="bags"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Bags;
