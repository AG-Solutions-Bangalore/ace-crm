import { useQuery, useQueryClient } from "@tanstack/react-query";
import BASE_URL from "@/config/BaseUrl";

const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 30 * 60 * 1000;

const fetchData = async (endpoint, token) => {
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
  return response.json();
};

const createQueryConfig = (queryKey, endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  return {
    queryKey,
    queryFn: () => fetchData(endpoint, token),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    retry: 2,
    ...options,
  };
};

export const useFetchBuyers = () => {
  return useQuery(createQueryConfig(["buyer"], "/api/panel-fetch-buyer"));
};

export const useFetchCompanys = () => {
  return useQuery(createQueryConfig(["branch"], "/api/panel-fetch-branch"));
};
export const useFetchProduct = () => {
  return useQuery(createQueryConfig(["product"], "/api/panel-fetch-product"));
};

export const useFetchContractNos = (company_sort) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["contractnoss", company_sort],
      `/api/panel-fetch-contract-no/${company_sort}`,
      {
        enabled: Boolean(company_sort),
      }
    )
  );

  const prefetchNextContractNos = async () => {
    if (company_sort) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["contractnoss", company_sort],
          `/api/panel-fetch-contract-no/${company_sort}`
        )
      );
    }
  };

  return { ...query, prefetchNextContractNos };
};

export const useFetchPortofLoadings = () => {
  return useQuery(
    createQueryConfig(["portofLoadings"], "/api/panel-fetch-portofLoading")
  );
};

export const useFetchContainerSizes = () => {
  return useQuery(
    createQueryConfig(["containersizes"], "/api/panel-fetch-container-size")
  );
};

export const useFetchPaymentTerms = () => {
  return useQuery(
    createQueryConfig(["paymentTerms"], "/api/panel-fetch-paymentTermsC")
  );
};

export const useFetchPorts = () => {
  return useQuery(
    createQueryConfig(["ports"], "/api/panel-fetch-country-port")
  );
};

export const useFetchCountrys = () => {
  return useQuery(createQueryConfig(["country"], "/api/panel-fetch-country"));
};

export const useFetchMarkings = () => {
  return useQuery(createQueryConfig(["markings"], "/api/panel-fetch-marking"));
};

export const useFetchItemNames = () => {
  return useQuery(
    createQueryConfig(["itemNames"], "/api/panel-fetch-itemname")
  );
};

export const useFetchDescriptionofGoods = () => {
  return useQuery(
    createQueryConfig(
      ["descriptionofGoodss"],
      "/api/panel-fetch-descriptionofGoods"
    )
  );
};

export const useFetchBagsTypes = () => {
  return useQuery(createQueryConfig(["bagTypes"], "/api/panel-fetch-bagType"));
};

//invoice apis

export const useContactRef = () => {
  return useQuery(
    createQueryConfig(["contractRefs"], "/api/panel-fetch-contract-ref")
  );
};
export const usePrereceipts = () => {
  return useQuery(
    createQueryConfig(["prereceipts"], "/api/panel-fetch-prereceipts")
  );
};

export const useProductCustomDescription = (contract_ref) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["productdesc", contract_ref],
      `/api/panel-fetch-product-description/${contract_ref}`,
      {
        enabled: Boolean(contract_ref),
      }
    )
  );

  const prefetchNextContractNos = async () => {
    if (contract_ref) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["productdesc", contract_ref],
          `/api/panel-fetch-product-description/${contract_ref}`
        )
      );
    }
  };

  return { ...query, prefetchNextContractNos };
};

export const useGRCode = (gr_code) => {
  const queryClient = useQueryClient();

  const query = useQuery(
    createQueryConfig(
      ["grcode", gr_code],
      `/api/panel-fetch-grcode/${gr_code}`,
      {
        enabled: Boolean(gr_code),
      }
    )
  );

  const prefetchNextContractNos = async () => {
    if (gr_code) {
      await queryClient.prefetchQuery(
        createQueryConfig(
          ["grcode", gr_code],
          `/api/panel-fetch-grcode/${gr_code}`
        )
      );
    }
  };

  return { ...query, prefetchNextContractNos };
};
