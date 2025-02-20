import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintContent = React.forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className="print-container">
      {/* Common Header - Will appear on every page */}
      <div className="print-header">
        <h2>Company Name</h2>
        <p>123 Business St, City, Country</p>
        <hr />
      </div>

      {/* Dynamic Content */}
      <div className="print-body">
        {data.map((item, index) => (
          <div key={index} className="print-section">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

const PrintComponent = () => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Printable Document",
    pageStyle: `
      @media print {
        .print-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: white;
          text-align: center;
          padding: 10px 0;
          border-bottom: 2px solid black;
        }
        .print-body {
          margin-top: 80px;
        }
        @page {
          size: A4;
          margin: 20mm;
        }
      }
    `,
  });

  const dynamicData = [
    { title: "Report 1", description: "This is the description for report 1." },
    { title: "Report 2", description: "This is the description for report 2." },
    { title: "Report 3", description: "This is the description for report 3." },
  ];

  return (
    <div>
      <button onClick={handlePrint}>Print</button>
      <PrintContent ref={printRef} data={dynamicData} />
    </div>
  );
};

export default PrintComponent;
