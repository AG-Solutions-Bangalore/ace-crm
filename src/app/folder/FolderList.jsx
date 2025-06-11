import { useQuery } from "@tanstack/react-query";
import Page from "../dashboard/page";
import CreateFolder from "./FolderCreate";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { Folder as FolderIcon } from "lucide-react";
import { ErrorComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const FolderList = () => {
  const navigate = useNavigate();

  const {
    data: fetchfolder,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-folder`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.fileFolder;
    },
  });

  if (isError) {
    return (
      <ErrorComponent message="Error Fetching Folder Data" refetch={refetch} />
    );
  }
  return (
    <Page>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-left text-2xl text-gray-800 font-[500]">Folders</h1>
        <CreateFolder refetch={refetch} />
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
          {fetchfolder.length == 0 ? (
            <h1 className="text-center text-xl text-gray-800 font-[500]">
              No Folder Avaiable
            </h1>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fetchfolder?.map((folder) => (
                <div
                  key={folder.file_folder_unique}
                  className="flex items-center gap-2 border rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/file/${folder.file_folder_unique}`)}
                >
                  <FolderIcon className="text-yellow-500" size={24} />
                  <span className="text-gray-700">{folder.file_folder}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default FolderList;
