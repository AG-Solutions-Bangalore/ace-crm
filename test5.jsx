// dont remove

const handleSaveAsPdf = () => {
  const element = containerRef.current;
  generatePdf(element);
};

const generatePdf = (element) => {
  const options = {
    margin: [30, 10, 30, 10], // Adjusted for header and footer space
    filename: "Payment.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      windowHeight: element.scrollHeight,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: "avoid" },
  };

  html2pdf()
    .from(element)
    .set(options)
    .toPdf()
    .get("pdf")
    .then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // ======= 🗂️ HEADER (3-Grid Layout) =======
        pdf.setFontSize(12);
        pdf.text("ACE GROUP", 10, 15); // Left Grid
        pdf.text("22 August 2023", pageWidth / 2, 15, { align: "center" }); // Center Grid
        pdf.text("Today's USD Rate:", pageWidth - 10, 15, { align: "right" }); // Right Grid

        // ======= 📊 FOOTER (5-Grid Layout) =======
        const footerY = pageHeight - 10; // Footer position

        pdf.setFontSize(10);
        pdf.text("14", 10, footerY); // First Grid
        pdf.text("2", pageWidth * 0.25, footerY); // Second Grid
        pdf.text("3", pageWidth * 0.45, footerY); // Third Grid
        pdf.text("4", pageWidth * 0.65, footerY); // Fourth Grid
        pdf.text("5", pageWidth * 0.85, footerY); // Fifth Grid
      }
    })
    .save();
};
