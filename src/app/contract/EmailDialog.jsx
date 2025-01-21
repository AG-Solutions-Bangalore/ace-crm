import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EmailDialog = ({ open, onClose, onSend }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onSend(email);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Contract via Email</DialogTitle>
        </DialogHeader>
        <Input
          type="email"
          placeholder="Enter recipient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;