

const handlePrintPdf = () => {
  const printContent = containerRef.current;
  const printWindow = window.open("", "", "height=500,width=800");

  // Create the header content (same as PrintHeader component)
  const printHeader = `
    <div class="print-header" style="position: fixed; top: 0; left: 0; right: 0; background-color: white; z-index: 1000; height: 200px;">
      <img src="/api/public/assets/images/letterHead/AceB.png" alt="logo" style="width: 100%; max-height: 120px; object-contain;" />
      <h1 style="text-align: center; font-size: 15px; text-decoration: underline; font-weight: bold; margin-top: 16px;">
        SALES CONTRACT
      </h1>
      <div style="padding: 16px; display: flex; justify-content: space-between;">
        <p><span style="font-weight: bold; font-size: 12px;">Cont No.:</span> ${contractData?.contract?.contract_ref}</p>
        <p><span style="font-weight: bold; font-size: 12px;">DATE:</span> ${moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}</p>
      </div>
    </div>
  `;

  // Open print window and write content
  printWindow.document.write("<html><head><title>Print Receipt</title>");

  // Add CSS styles to the print window
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch (e) {
        console.log("Accessing cross-origin styles is not allowed, skipping.");
        return "";
      }
    })
    .join("");

  printWindow.document.write(`
    <style>
      ${styles}

      @media print {
        body {
          margin: 0mm;
          padding: 50mm 5mm 1mm 1mm;
          min-height: 100vh;
        }
        .print-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: white;
          z-index: 1000;
          height: 200px;
        }
        .print-container {
          page-break-inside: avoid;
        }
        .print-container p, .print-container div {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        /* Adjust the margin for the first page */
        @page :first {
          margin-bottom: 100px; /* Keep some space for the header on the first page */
        }

        /* For subsequent pages, ensure content starts below the header */
        @page :not(:first) {
          margin-top: 100px; /* Apply margin-top to subsequent pages only */
        }

        /* Adjust content position from the second page onward */
        .print-container {
          margin-top: 100px; /* Set this margin for pages after the first */
        }
      }
    </style>
  `);

  printWindow.document.write("</head><body>");
  // Write the header and content to the print window
  printWindow.document.write(printHeader); // Insert the header
  printWindow.document.write(printContent.innerHTML); // Insert the main content
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
};