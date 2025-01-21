const handleInputChange = (e, field) => {
  let value;
  value = e.target.value;
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

<div>
  <label className="block text-sm font-medium mb-2">
    Buyer <span className="text-red-500">*</span>
  </label>
  <Select
    value={formData.contract_buyer}
    onValueChange={(value) => {
      const selectedBuyer = buyerData?.buyer?.find(
        (buyer) => buyer.buyer_name === value
      );
      handleInputChange({ target: { value } }, "contract_buyer");

      if (selectedBuyer) {
        handleInputChange(
          { target: { value: selectedBuyer.buyer_address } },
          "contract_buyer_add"
        );
      }
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Buyer" />
    </SelectTrigger>
    <SelectContent>
      {buyerData?.buyer?.map((buyer) => (
        <SelectItem key={buyer.buyer_name} value={buyer.buyer_name.toString()}>
          {buyer.buyer_name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  <CreateCustomer />
</div>;
