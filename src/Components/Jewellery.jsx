import React from "react";
import GridProductCategory from "./GridProductCategory";
import JewellerySidebarFilter from "./JewellerySidebarFilter";

const Jewellery = () => {
  return (
    <GridProductCategory
      categoryName="jewellery"
      SidebarFilterComponent={JewellerySidebarFilter}
    />
  );
};

export default Jewellery;
