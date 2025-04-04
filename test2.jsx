const handleRowDataChange = useCallback(
  (rowIndex, field, value) => {
    setConsigneData((prev) => {
      const newData = [...prev]; // Create a new array (immutability)
      let sanitizedValue = value;

      const numericFields = [
        "costingSub_ex_colour",
        "costingSub_ex_pungency",
        "costingSub_pungency",
        "costingSub_colour",
        "costingSub_rm_cost",
        "costingSub_percentage",
      ];

      if (numericFields.includes(field)) {
        sanitizedValue = value.replace(/[^\d.]/g, "");
        if ((sanitizedValue.match(/\./g) || []).length > 1) return prev;
      }

      newData[rowIndex] = { ...newData[rowIndex], [field]: sanitizedValue };

      // Update Material Cost
      let percentageValue =
        parseFloat(newData[rowIndex].costingSub_percentage) || 0;
      let rmCost = parseFloat(newData[rowIndex].costingSub_rm_cost) || 0;
      newData[rowIndex].costingSub_material_cost = (
        (percentageValue / 100) *
        rmCost
      ).toFixed(2);

      // Update Ex Colour
      let colourValue = parseFloat(newData[rowIndex].costingSub_colour) || 0;
      newData[rowIndex].costingSub_ex_colour = (
        (percentageValue / 100) *
        colourValue
      ).toFixed(2);

      // Update Ex Pungency
      let pungencyValue =
        parseFloat(newData[rowIndex].costingSub_pungency) || 0;
      newData[rowIndex].costingSub_ex_pungency = (
        (percentageValue / 100) *
        pungencyValue
      ).toFixed(2);

      return newData;
    });

    // Update costing_raw_material in costingeData (Use setCostingData separately)
    if (field === "costingSub_material_cost") {
      setCostingData((prev) => {
        let currentRawMaterial = parseFloat(prev.costing_raw_material) || 0;
        let percentageValue = parseFloat(value) || 0;
        return {
          ...prev,
          costing_raw_material: (currentRawMaterial + percentageValue).toFixed(
            2
          ),
        };
      });
    }
  },
  [setCostingData]
);
