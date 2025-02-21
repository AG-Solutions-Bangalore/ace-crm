

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate PDF
      // without header without sign
      // const pdfBlob = await mailWoheaderWoSign(pdfRef.current);
      // with header without sign
      const pdfBlob = await handleEmail(pdfRef.current);

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("to_email", formData.to_email);
      formDataToSend.append("subject_email", formData.subject_email);
      formDataToSend.append("description_email", formData.description_email);
      formDataToSend.append("attachment_email", pdfBlob, "Sales_Contract.pdf");

      // Send email
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://exportbiz.in/public/api/panel-send-document-email",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      // if (!response.ok) {
      //   throw new Error("Failed to send email");
      // }
      console.log(response);
      if (response?.data?.code == 200) {
        toast({
          title: "Success",
          description: response.data.msg,
        });
        setIsOpen(false);
        setFormData({
          to_email: "",
          subject_email: "",
          description_email: "",
          attachment_email: null,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.msg,
          variant: "destructive",
        });
      }
      // Close dialog and reset form
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setLoading(false);
    }
  };