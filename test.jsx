import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Page from "../dashboard/page";

const PrintContent = React.forwardRef(({ data }, ref) => {
  return (
    <Page>
      <div ref={ref} className="print-container">
        <table>
          {/* Thead ensures header repeats on each page */}
          <thead>
            <tr className="print-header">
              <th colSpan="2">
                <h2>Company Name</h2>
                <p>123 Business St, City, Country</p>
                <hr />
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`print-section ${index === 20 ? "page-margin" : ""}`}
              >
                <td className="print-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
});

const PrintComponent = () => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Printable Document",
    pageStyle: `
      @media print {
        /* Ensure header repeats */
        thead { display: table-header-group; }
        
        .print-header {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          padding: 10px 0;
          background: white;
          border-bottom: 2px solid black;
        }

        /* Push content down to avoid overlap */
        .print-container {
          margin-top: 20px;
        }

        .print-body {
          margin-top: 10px;
          page-break-inside: avoid;
        }

        .print-section {
          margin-bottom: 20px;
        }

        /* Ensure second page starts with margin-top: 100px */
        .page-margin {
          margin-top: 100px !important;
        }

        .page-break {
          page-break-before: always;
        }

        @page {
          size: A4;
          margin: 20mm;
        }
      }
    `,
  });

  const dynamicData = Array.from({ length: 50 }, (_, i) => ({
    title: `Report ${i + 1}`,
    description: `This is the description for report ${i + 1}.`,
  }));

  return (
    <div>
      <button onClick={handlePrint}>
        Printgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
      </button>

      {/* Printable content */}
      <PrintContent ref={printRef} data={dynamicData} />
    </div>
  );
};

export default PrintComponent;


const handleSaveAsPdf = async () => {
  if (!containerRef.current) return;

  const opt = {
    margin: 10,
    filename: "purchase_order.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    const pdfBlob = await html2pdf()
      .from(containerRef.current)
      .set(opt)
      .outputPdf("blob");

    // Convert Blob to File safely
    const pdfFile = new Blob([pdfBlob], { type: "application/pdf" });
    const fileName = "purchase_order.pdf";

    // Simulate a File object by appending the filename to the blob
    pdfFile.name = fileName; // Some browsers may not support this, but it's a workaround.

    setPdfFile(pdfFile);
    if (pdfFile) {
      setIsDialogOpen(true);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};