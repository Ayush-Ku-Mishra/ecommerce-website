import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Beauty = () => {
  return (
    <GridProductCategory
      categoryName="beauty"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Beauty;
