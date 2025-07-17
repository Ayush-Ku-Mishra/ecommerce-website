import React from "react";
import GridProductCategory from "./GridProductCategory";
import BagsSidebarFilter from "./BagsSidebarFilter";

const Bags = () => {
  return (
    <GridProductCategory
      categoryName="bags"
      SidebarFilterComponent={BagsSidebarFilter}
    />
  );
};

export default Bags;
