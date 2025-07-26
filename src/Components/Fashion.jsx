import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Fashion = () => {
  return (
    <GridProductCategory
      categoryName="fashion"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Fashion;
