import React from "react";

export const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return <thead className="bg-[#b1cbfa]">{children}</thead>;
};

export const TableRow = ({ children }) => {
  return <tr className="border-b border-gray-400">{children}</tr>;
};

export const TableHead = ({ children }) => {
  return (
    <th className="px-4 py-2 text-left font-semibold border border-gray-400">
      {children}
    </th>
  );
};

export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TableCell = ({ children , rightAlign}) => {
  return <td className={`px-4 py-2 border border-gray-300 ${rightAlign ? "text-right" : ""}`}>{children}</td>;
};
