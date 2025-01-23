 branch_short  // 1
 branch_name  // 4
 branch_address // 5
//  invoice_year   dont show but send on sumbit
 invoice_date // 3
 invoice_no // 2
 invoice_ref  // 9
 contract_date // 8
 contract_ref  // 6
 contract_pono // 7
 invoice_buyer  // 10
 invoice_buyer_add // 14
 invoice_consignee // 11
 invoice_consignee_add // 15
 invoice_container_size // 23 
 invoice_loading // 18
 invoice_destination_port // 19
 invoice_discharge // 20 
 invoice_cif // 21
 invoice_destination_country // 22 
 invoice_payment_terms // 27
 invoice_remarks // 29
 invoice_product // 13
 invoice_consig_bank // 12
 invoice_prereceipts // 17
 invoice_precarriage // 28
 invoice_product_cust_des // 24
 invoice_gr_code // 26
 invoice_lut_code // 25 
 invoice_consig_bank_address // 16

 <MemoizedSelect
                    value={formData.contract_ref}
                    onChange={(value) => handleSelectChange("contract_ref", value)}
                    options={
                      contractRefsData?.contractRef?.map((contractRef) => ({
                        value: contractRef.contract_ref,
                        label: contractRef.contract_ref,
                      })) || []
                    }
                    placeholder="Select Contract Ref."
                  />

/*
 <div>
                    <label className="block text-sm font-medium mb-2">
                    Company <span className="text-red-500">*</span>
                    </label>
                    <ShadcnSelect
                    value={formData.branch_short}
                    onValueChange={(value) => {
                        const selectedCompanySort = branchData?.branch?.find(
                        (branch) => branch.branch_short === value
                        );
                        
                        handleInputChange(
                        { target: { value } },
                        "branch_short"
                        );
                        if (selectedCompanySort) {
                        handleInputChange(
                            { target: { value: selectedCompanySort.branch_name } },
                            "branch_name"
                        );
                        handleInputChange(
                            { target: { value: selectedCompanySort.branch_address } },
                            "branch_address"
                        );
                        fetchLUT(selectedCompanySort.branch_scheme);
                        
                        
                        
                        }
                        
                    }}


                      <label className="block text-sm font-medium mb-2">
                  Consignee <span className="text-red-500">*</span>
                  </label>
                  <ShadcnSelect
                    value={formData.invoice_consignee}
                    onValueChange={(value) => {
                      const selectedBuyer = buyerData?.buyer?.find(
                        (buyer) => buyer.buyer_name === value
                      );
                      handleInputChange(
                        { target: { value } },
                        "invoice_consignee"
                      );
                      if (selectedBuyer) {
                        handleInputChange(
                          { target: { value: selectedBuyer.buyer_address } },
                          "invoice_consignee_add"
                        );
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {buyerData?.buyer?.map((buyer) => (
                        <SelectItem
                          key={buyer.buyer_name}
                          value={buyer.buyer_name.toString()}
                        >
                          {buyer.buyer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </ShadcnSelect>
               
                    >


















                     <label className="block text-sm font-medium mb-2">
                    Consig. Bank <span className="text-red-500">*</span>
                    </label>
                    
                    <ShadcnSelect
                    value={formData.invoice_consig_bank}
                    onValueChange={(value) =>
                        handleInputChange({ target: { value } }, "invoice_consig_bank")
                    }
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Consig. Bank" />
                    </SelectTrigger>
                    <SelectContent>
                        {buyerData?.buyer?.map((buyer) => (
                        <SelectItem
                            key={buyer.buyer_name}
                            value={buyer.buyer_name.toString()}
                        >
                            {buyer.buyer_name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </ShadcnSelect>
                    















 <label className="block text-sm font-medium mb-2">
                    Product <span className="text-red-500">*</span>
                    </label>
                    <ShadcnSelect
                    value={formData.contract_product}
                    onValueChange={(value) =>{
                        handleInputChange({ target: { value } }, "contract_product")
                        fetchProductCustomDescription(value);
                        fetchGRCode(value);
                    }
                        
                    }
                    
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                        {productData?.product?.map((product) => (
                        <SelectItem
                            key={product.product_name}
                            value={product.product_name.toString()}
                        >
                            {product.product_name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </ShadcnSelect>





























                    




*/