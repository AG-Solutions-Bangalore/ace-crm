import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Mail, MessageCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ContractActions = ({
  handleWithHeaderPrint,
  handleWithoutHeaderPrint,
  handleSignWithoutHeader,
  handleSignWithHeaderPrint
}) => {
  const [withHeader, setWithHeader] = useState(false); // Default is without header
 const [withSign, setWithSign] = useState(false);
  const handleHeaderChange = (checked) => {
    setWithHeader(checked);
  };
  const handleSignChange = (checked) => {
    setWithSign(checked);
  };

  const handlePrint = () => {
    if (withHeader && withSign) {
      handleSignWithHeaderPrint();
    } else if (withHeader) {
      handleWithHeaderPrint();
    } else if (withSign) {
      handleWithoutHeaderPrint();
    } else {
      handleSignWithoutHeader();
    }
  };

  // const handleSave = () => {
  //   withHeader ? handleSaveAsPdf() : handleSaveAsWidthoutHeaderPdf();
  // };

  // const handleWhatsapp = () => {
  //   withHeader ? whatsappPdf() : whatsappWithoutHeaderPdf();
  // };

  return (
    <Tabs defaultValue="header" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="header">Actions</TabsTrigger>
      </TabsList>
      <TabsContent value="header">
        <div className="flex flex-col gap-4 mt-4">

          <Button
            onClick={handlePrint}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print PDF</span>
          </Button>

          {/* <Button
            onClick={handleSave}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Save as PDF</span>
          </Button> */}

          <Button
            onClick={() => {}}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <Mail className="h-4 w-4" />
            <span>Send Mail</span>
          </Button>

          {/* <Button
            onClick={handleWhatsapp}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </Button> */}

<div className="flex items-center space-x-2">
            <Checkbox
              id="withHeader"
              checked={withHeader}
              onCheckedChange={handleHeaderChange}
            />
            <Label htmlFor="withHeader">With Header</Label>
          </div>
            <div className="flex items-center space-x-2">
                      <Checkbox
                        id="withSign"
                        checked={withSign}
                        onCheckedChange={handleSignChange}
                      />
                      <Label htmlFor="withSign">With Sign</Label>
                    </div>

        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContractActions;
