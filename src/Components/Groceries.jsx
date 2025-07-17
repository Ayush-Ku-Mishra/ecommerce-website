import React from "react";
import GridProductCategory from "./GridProductCategory";
import GroceriesSidebarFilter from "./GroceriesSidebarFilter";

const Groceries = () => {
  return (
    <GridProductCategory
      categoryName="groceries"
      SidebarFilterComponent={GroceriesSidebarFilter}
    />
  );
};

export default Groceries;
