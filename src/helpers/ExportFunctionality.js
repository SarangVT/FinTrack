import jsPDF from "jspdf";
import "jspdf-autotable";

export const transformDataForExport = (data, codeOfCurrency) => {
    return data.map((txn) => {
      const { id, increment, user_id, date, ...rest } = txn;
      const formattedDate = date.slice(0, 10);
      const sign = increment ? "+" : "-";
      return {
        ...rest,
        date: formattedDate,
        amount: `${sign}${txn.amount} ${codeOfCurrency}`,
        currentbalance: `${txn.currentbalance} ${codeOfCurrency}`
      };
    });
};

export const convertToCSV = (data, codeOfCurrency) => {
    if (!data.length) return "";

    const transformedData = transformDataForExport(data, codeOfCurrency);

    const headers = Object.keys(transformedData[0]).map((key) => key.toUpperCase()).join(",");

    const rows = transformedData.map((row) => Object.values(row).map((value) => `${value}`).join(","));
    
    return [headers, ...rows].join("\n");
};

export const handleExportCSV = (sortedTransactions, codeOfCurrency) => {
    const csvContent = convertToCSV(sortedTransactions, codeOfCurrency);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const handleExportPDF = (sortedTransactions, codeOfCurrency) => {
    const transformedData = transformDataForExport(sortedTransactions, codeOfCurrency);
    const columns = Object.keys(transformedData[0]).map((key) => key.toUpperCase());
    const rows = transformedData.map((row) => Object.values(row));
    const doc = new jsPDF();
    doc.autoTable({head: [columns], body: rows,});
    doc.save("transactions.pdf");
};