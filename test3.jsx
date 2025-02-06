const createBranchMutation = useMutation({
  mutationFn: createBranch,
  onSuccess: (response) => {



    if (response.code == 200) {
      toast({
        title: "Success",
        description: response.msg, 
      });
      navigate("/master/branch");
    } else {
      toast({
        title: "Error",
        description: response.msg, 
        variant: "destructive",
      });
    }







  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});
