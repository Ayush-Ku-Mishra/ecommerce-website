import React from "react";
import GridProductCategory from "./GridProductCategory";
import FootwearSidebarFilter from "./FashionSidebarFilter";

const Footwear = () => {
  return (
    <GridProductCategory
      categoryName="footwear"
      SidebarFilterComponent={FootwearSidebarFilter}
    />
  );
};

export default Footwear;
