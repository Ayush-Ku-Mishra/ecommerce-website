import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Jewellery = () => {
  return (
    <GridProductCategory
      categoryName="jewellery"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Jewellery;
