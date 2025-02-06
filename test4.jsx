const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${BASE_URL}/api/panel-create-bagType`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });




    if (response?.data.code == 200) {
    
      toast({
        title: "Success",
        description: response.data.msg
      });

      setFormData({
        prereceipts_name: "",
      });
      await queryClient.invalidateQueries(["prereceipt"]);

      setOpen(false);
    } else {
     
      toast({
        title: "Error",
        description: response.data.msg,
        variant: "destructive",
      });
    }














  } catch (error) {
 
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to create Bag Type",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};