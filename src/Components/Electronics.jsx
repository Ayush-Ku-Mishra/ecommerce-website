import React from "react";
import GridProductCategory from "./GridProductCategory";
import CategorySidebarFilter from "./FurnituresSidebarFilter";

const Electronics = () => {
  return (
    <GridProductCategory
      categoryName="electronics"
      SidebarFilterComponent={CategorySidebarFilter}
    />
  );
};

export default Electronics;
