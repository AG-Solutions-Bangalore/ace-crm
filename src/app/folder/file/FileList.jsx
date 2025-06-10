import Page from "@/app/dashboard/page";
import { ErrorComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Skeleton } from "@/components/ui/skeleton";
import BASE_URL from "@/config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { File } from "lucide-react";
import { useParams } from "react-router-dom";
import CreateFile from "./CreateFile";

const FileList = () => {
  const { id } = useParams();
  const {
    data: fetchfile,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["file", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-file-folder`,
        { file_folder_unique: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.file || [];
    },
  });

  if (isError) {
    return (
      <ErrorComponent message="Error Fetching File Data" refetch={refetch} />
    );
  }
  return (
    <Page>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-left text-2xl text-gray-800 font-[500]">File</h1>
        <CreateFile id={id} refetch={refetch} />
      </div>
      {isFetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-lg p-3 shadow-sm"
            >
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {fetchfile.length == 0 ? (
            <h1 className="text-center text-xl text-gray-800 font-[500]">
              No File Avaiable
            </h1>
          ) : (
            // <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            //   {fetchfile?.map((file) => (
            //     <div
            //       key={file.path}
            //       className="flex items-center gap-2 border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            //     >
            //       <File className="text-yellow-500" size={24} />
            //       <span className="text-gray-700">
            //         {file.name.split(".")[0]}
            //       </span>
            //     </div>
            //   ))}
            // </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fetchfile?.map((file) => {
                const relativePath = file.path.split("public_html/")[1]; // Get path after 'public_html/'
                // const fileUrl = `https://exportbiz.in/${relativePath}`; // Your domain
                // console.log(relativePath, "relativePath");
                return (
                  <a
                    key={file.path}
                    href={relativePath}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border rounded-lg p-3 shadow-sm hover:shadow-md transition"
                  >
                    <File className="text-yellow-500" size={24} />
                    <span className="text-gray-700">
                      {file.name.split(".")[0]}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default FileList;
