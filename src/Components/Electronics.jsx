import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Electronics = () => {
  return (
    <GridProductCategory
      categoryName="electronics"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Electronics;
