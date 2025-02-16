import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const IncomeExpenseGraph = ({ data, symbol }) => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showGrid, setShowGrid] = useState(true);

  const filterData = () => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    let filtered = [...data];
    const currentDate = new Date();

    if (timeRange === "monthly") {
      let prevMonth;
      if (currentDate.getMonth() === 0) {
        prevMonth = new Date(currentDate.getFullYear() - 1, 11, 1);
      } else {
        prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      }
      filtered = data.filter((d) => new Date(d.date) >= prevMonth);
    }
    
    if (timeRange === "yearly") {
      const prevYear = new Date(currentDate.getFullYear() - 1, 0, 1);
      filtered = data.filter((d) => new Date(d.date) >= prevYear);
    }

    if (timeRange === "custom" && startDate && endDate) {
      filtered = data.filter((d) => {
        const dataDate = new Date(d.date);
        return dataDate >= startDate && dataDate <= endDate;
      });
    }

    return filtered.map((d) => ({
      date: format(new Date(d.date), "MMM d, yyyy"),
      Income: d.increment ? d.amount : 0,
      Expense: !d.increment ? d.amount : 0,
    }));
  };

  return (
    <div className="p-4 w-full border rounded-lg shadow-md">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Income & Expense Graph</h2>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="all-time">All Time</option>
              <option value="custom">Custom</option>
            </select>
            {timeRange === "custom" && (
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  className="border p-2 rounded"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()} 
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  className="border p-2 rounded"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()} 
                />
              </div>
            )}
            <label className="flex items-center cursor-pointer">
              <span className="mr-2">Grid</span>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={() => setShowGrid(!showGrid)}
                className="hidden"
              />
              <div className={`w-10 h-5 rounded-full p-1 flex items-center ${showGrid ? "bg-blue-400": "bg-gray-300"}`}>
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${showGrid ? 'translate-x-5' : ''}`}
                ></div>
              </div>
            </label>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filterData()} margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis/>
            <Tooltip />
            <Legend formatter={(value) => {return value === "Income" ? `Income (${symbol})` : `Expense (${symbol})`;}}/>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <Line type="monotone" dataKey="Income" stroke="#4CAF50" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Expense" stroke="#F44336" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseGraph;
