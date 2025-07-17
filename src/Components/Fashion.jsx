import React from "react";
import GridProductCategory from "./GridProductCategory";
import FashionSidebarFilter from "./FashionSidebarFilter";

const Fashion = () => {
  return (
    <GridProductCategory
      categoryName="fashion"
      SidebarFilterComponent={FashionSidebarFilter}
    />
  );
};

export default Fashion;
