import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, Mail, MessageCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ContractActions = ({ 
  handlPrintPdf, 
  handleSaveAsPdf, 
  whatsappPdf,
  handleSaveAsWidthoutHeaderPdf,
  whatsappWithoutHeaderPdf 
}) => {
  const [withHeader, setWithHeader] = useState(true);
  const [withoutHeader, setWithoutHeader] = useState(false);

  const handleHeaderChange = (checked) => {
    if (checked) {
      setWithHeader(true);
      setWithoutHeader(false);
    }
  };

  const handleWithoutHeaderChange = (checked) => {
    if (checked) {
      setWithoutHeader(true);
      setWithHeader(false);
    }
  };

  const handlePrint = () => {
    if (withHeader) handlPrintPdf();
    if (withoutHeader) console.log("Print without header");
  };

  const handleSave = () => {
    if (withHeader) handleSaveAsPdf();
    if (withoutHeader) handleSaveAsWidthoutHeaderPdf();
  };

  const handleWhatsapp = () => {
    if (withHeader) whatsappPdf();
    if (withoutHeader) whatsappWithoutHeaderPdf();
  };

  return (
    <Tabs defaultValue="header" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="header">Actions</TabsTrigger>
      </TabsList>
      <TabsContent value="header">
        <div className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
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
                id="withoutHeader"
                checked={withoutHeader}
                onCheckedChange={handleWithoutHeaderChange}
              />
              <Label htmlFor="withoutHeader">Without Header</Label>
            </div>
          </div>
          
          <Button
            onClick={handlePrint}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print PDF</span>
          </Button>
          
          <Button
            onClick={handleSave}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Save as PDF</span>
          </Button>
          
          <Button
            onClick={() => {}}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <Mail className="h-4 w-4" />
            <span>Send Mail</span>
          </Button>
          
          <Button
            onClick={handleWhatsapp}
            className="w-full bg-yellow-200 text-black hover:bg-yellow-500 flex items-center justify-start gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContractActions;