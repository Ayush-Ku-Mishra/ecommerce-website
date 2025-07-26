import React from "react";
import GridProductCategory from "./GridProductCategory";
import SidebarFilterComponent from "./SidebarFilterComponent";

const Groceries = () => {
  return (
    <GridProductCategory
      categoryName="groceries"
      SidebarFilterComponent={SidebarFilterComponent}
    />
  );
};

export default Groceries;
