if (loading) {
  return <LoaderComponent name="Pre_Shipment Data" />; // ✅ Correct prop usage
}

// Render error state
if (error) {
  return (
    <ErrorComponent
      message="Error Fetching Pre_Shipment  Data"
      refetch={() => fetchContractData}
    />
  );
}

if (isLoading) {
  return <WithoutLoaderComponent name="UserType Data" />; // ✅ Correct prop usage
}

// Render error state
if (isError) {
  return <WithoutErrorComponent message="Error UserType Data" refetch={refetch} />;
}
