import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#008000", "#FF00FF"];

const IncomePieChart = ({ data, symbol}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewType, setViewType] = useState("yearly");

  useEffect(() => {
    filterTransactions();
  }, [data, startDate, endDate, viewType]);

  const filterTransactions = () => {
    let filtered = data.filter(t => t.increment === true);
    if (viewType === "monthly") {
      filtered = filtered.filter((t) => dayjs(t.date).isSame(dayjs(), "month"));
    } else if (viewType === "yearly") {
      filtered = filtered.filter((t) => dayjs(t.date).isSame(dayjs(), "year"));
    } else if (viewType === "custom" && startDate && endDate) {
      filtered = filtered.filter((t) => dayjs(t.date).isAfter(dayjs(startDate).startOf("day")) && dayjs(t.date).isBefore(dayjs(endDate).endOf("day")));
    }
    setFilteredData(filtered);
  };

  const getChartData = () => {
    const categoryMap = {};
    let totalIncome = 0;
    filteredData.forEach((t) => {
      if (!categoryMap[t.description]) {
        categoryMap[t.description] = 0;
      }
      categoryMap[t.description] += parseFloat(t.amount);
      totalIncome += parseFloat(t.amount);
    });
    return {
      data: Object.keys(categoryMap).map((key, index) => ({
        name: key,
        value: categoryMap[key],
        percentage: ((categoryMap[key] / totalIncome) * 100).toFixed(2) + "%",
        color: COLORS[index % COLORS.length],
      })),
      totalIncome,
    };
  };

  const { data: chartData, totalIncome } = getChartData();
  const hideLegend = chartData.length > 3;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 items-center">
        <select value={viewType} onChange={(e) => setViewType(e.target.value)} className="p-2 border-white font-bold rounded-lg bg-white focus:outline-none">
          <option value="all">All Time</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>

        {viewType === "custom" && (
          <>
            <DatePicker maxDate={new Date()} selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} placeholderText="Start Date" showMonthDropdown showYearDropdown/>
            <DatePicker maxDate={new Date()}  selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} placeholderText="End Date" showMonthDropdown showYearDropdown/>
          </>
        )}
      </div>
      
      <div className="w-full p-4 shadow-lg rounded-lg bg-white">
        <h2 className="text-center font-bold">Income</h2>
        <p className="text-center font-bold">Total: {symbol}{totalIncome.toFixed(2)}</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} label={(entry) => `${entry.name} (${entry.percentage})`}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`$${value.toFixed(2)} (${props.payload.percentage})`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomePieChart;