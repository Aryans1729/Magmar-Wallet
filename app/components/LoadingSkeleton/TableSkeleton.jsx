import React from "react";

const TableSkeleton = () => {
  return (
    <div role="status" className="w-[100%] animate-pulse">
      <div className="h-[2.5rem] bg-gray-200 rounded-[10px] dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-[2.5rem] bg-gray-200 rounded-[10px] dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-[2.5rem] bg-gray-200 rounded-[10px] dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-[2.5rem] bg-gray-200 rounded-[10px] dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-[2.5rem] bg-gray-200 rounded-[10px] dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-[2.5rem] bg-gray-200 rounded-[10px] dark:bg-gray-700 w-full mb-4"></div>
    </div>
  );
};

export default TableSkeleton;
