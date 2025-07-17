import React from "react";
import GridProductCategory from "./GridProductCategory";
import BeautySidebarFilter from "./BeautySidebarFilter";

const Beauty = () => {
  return (
    <GridProductCategory
      categoryName="beauty"
      SidebarFilterComponent={BeautySidebarFilter}
    />
  );
};

export default Beauty;
