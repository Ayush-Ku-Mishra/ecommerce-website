import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Fashion = () => {
  return (
    <GridProductCategory
      categoryName="Fashion"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Fashion;