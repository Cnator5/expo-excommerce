import { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/react-native";
import { useApi } from "@/lib/api";

export type Category = {
  _id: string;
  name: string;
  image?: string;
};

const useCategories = () => {
  const api = useApi();
  const [data, setData] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await api.get("/category");
      const categories = res?.data?.data ?? [];
      setData(categories);
    } catch (error) {
      setIsError(true);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    data,
    isLoading,
    isError,
    refetch: fetchCategories,
  };
};

export default useCategories;