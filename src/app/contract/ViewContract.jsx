import React, { useEffect, useState } from "react";
import Page from "../dashboard/page";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js"; // Import html2pdf
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";
import EmailDialog from "./EmailDialog";
import logo from "../../../public/assets/logo_ace.png";

const ViewContract = () => {
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-contract-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contract data");
        }

        const data = await response.json();
        setContractData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);
  const handlePDF = async () => {
    try {
      // Get the HTML element to convert to PDF
      const element = document.getElementById("contract-details");
  
      // Convert the logo to a data URL
      const toDataURL = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
  
      const logoDataURL = await toDataURL(logo);
  
      // Options for the PDF
      const options = {
        margin: 10,
        filename: `contract_${id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 }, // Increase scale for better quality
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      // Create a new PDF instance
      const pdf = new html2pdf().set(options);
  
      // Split the content into pages
      const pageHeight = 297; // A4 page height in mm
      const margin = 10; // Margin in mm
      const contentHeight = pageHeight - 2 * margin; // Available height for content
  
      // Create a temporary container for the content
      const tempContainer = document.createElement("div");
      tempContainer.style.visibility = "hidden";
      tempContainer.style.position = "absolute";
      tempContainer.style.top = "-9999px";
      document.body.appendChild(tempContainer);
  
      // Clone the original content
      const originalContent = element.cloneNode(true);
      tempContainer.appendChild(originalContent);
  
      // Split the content into pages
      let currentHeight = 0;
      let pageContent = [];
      let currentPage = [];
  
      Array.from(originalContent.children).forEach((child) => {
        const childHeight = child.offsetHeight * (options.html2canvas.scale || 1);
  
        if (currentHeight + childHeight > contentHeight) {
          // Add the current page to the PDF
          pageContent.push(currentPage);
          currentPage = [];
          currentHeight = 0;
        }
  
        currentPage.push(child);
        currentHeight += childHeight;
      });
  
      // Add the last page
      if (currentPage.length > 0) {
        pageContent.push(currentPage);
      }
  
      // Remove the temporary container
      document.body.removeChild(tempContainer);
  
      // Add the logo and content to each page
      pageContent.forEach((page, index) => {
        const pageElement = document.createElement("div");
        pageElement.style.position = "relative";
  
        // Add the logo to the top of the page
        const logoElement = document.createElement("img");
        logoElement.src = logoDataURL;
        logoElement.style.width = "100px";
        logoElement.style.marginBottom = "10px";
        pageElement.appendChild(logoElement);
  
        // Add the content to the page
        page.forEach((child) => {
          pageElement.appendChild(child.cloneNode(true));
        });
  
        // Add the page to the PDF
        if (index > 0) {
          pdf.addPage();
        }
        pdf.from(pageElement).toPdf().get("pdf").then((pdfDoc) => {
          pdfDoc.save(`contract_${id}.pdf`);
        });
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading contract Data
          </Button>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching contract Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div id="contract-details">
        <div className="flex justify-between">
          <h1>Contract Details</h1>
          <div>
            <button
              className="border border-gray-200 p-1 bg-blue-100 rounded-lg hover:bg-blue-500 mr-2"
              onClick={handlePDF}
            >
              Generate PDF
            </button>
          </div>
        </div>
        {contractData && (
          <>
            <h2>Contract Information</h2>
            <img
              src={logo}
              alt="img"
              width={500}
              height={100}
              className="bg-cover"
            />
            <div className="grid grid-cols-2">
              <p>
                <strong>ID:</strong> {contractData.contract.id}
              </p>
              <p>
                <strong>Company ID:</strong> {contractData.contract.company_id}
              </p>
              <p>
                <strong>Branch Short:</strong>{" "}
                {contractData.contract.branch_short}
              </p>
              <p>
                <strong>Branch Name:</strong>{" "}
                {contractData.contract.branch_name}
              </p>
              <p>
                <strong>Branch Address:</strong>{" "}
                {contractData.contract.branch_address}
              </p>
              <p>
                <strong>Contract Year:</strong>{" "}
                {contractData.contract.contract_year}
              </p>
              <p>
                <strong>Contract Date:</strong>{" "}
                {contractData.contract.contract_date}
              </p>
              <p>
                <strong>Contract No:</strong>{" "}
                {contractData.contract.contract_no}
              </p>
              <p>
                <strong>Contract Ref:</strong>{" "}
                {contractData.contract.contract_ref}
              </p>
              <p>
                <strong>Contract PONO:</strong>{" "}
                {contractData.contract.contract_pono}
              </p>
              <p>
                <strong>Contract Buyer:</strong>{" "}
                {contractData.contract.contract_buyer}
              </p>
              <p>
                <strong>Contract Buyer Address:</strong>{" "}
                {contractData.contract.contract_buyer_add}
              </p>
              <p>
                <strong>Contract Consignee:</strong>{" "}
                {contractData.contract.contract_consignee}
              </p>
              <p>
                <strong>Contract Consignee Address:</strong>{" "}
                {contractData.contract.contract_consignee_add}
              </p>
            </div>

            <h2>Contract Sub Details</h2>
            <table border="1" cellPadding="5" cellSpacing="0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Marking</th>
                  <th>Description of Goods</th>
                  <th>Item Bag</th>
                  <th>Packing</th>
                  <th>Bag Size</th>
                  <th>Quantity in MT</th>
                  <th>Rate MT</th>
                  <th>SBAGA</th>
                </tr>
              </thead>
              <tbody>
                {contractData.contractSub.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>{sub.contractSub_item_name}</td>
                    <td>{sub.contractSub_marking}</td>
                    <td>{sub.contractSub_descriptionofGoods}</td>
                    <td>{sub.contractSub_item_bag}</td>
                    <td>{sub.contractSub_packing}</td>
                    <td>{sub.contractSub_bagsize}</td>
                    <td>{sub.contractSub_qntyInMt}</td>
                    <td>{sub.contractSub_rateMT}</td>
                    <td>{sub.contractSub_sbaga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table border="1" cellPadding="5" cellSpacing="0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Marking</th>
                  <th>Description of Goods</th>
                  <th>Item Bag</th>
                  <th>Packing</th>
                  <th>Bag Size</th>
                  <th>Quantity in MT</th>
                  <th>Rate MT</th>
                  <th>SBAGA</th>
                </tr>
              </thead>
              <tbody>
                {contractData.contractSub.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>{sub.contractSub_item_name}</td>
                    <td>{sub.contractSub_marking}</td>
                    <td>{sub.contractSub_descriptionofGoods}</td>
                    <td>{sub.contractSub_item_bag}</td>
                    <td>{sub.contractSub_packing}</td>
                    <td>{sub.contractSub_bagsize}</td>
                    <td>{sub.contractSub_qntyInMt}</td>
                    <td>{sub.contractSub_rateMT}</td>
                    <td>{sub.contractSub_sbaga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Page>
  );
};

export default ViewContract;
