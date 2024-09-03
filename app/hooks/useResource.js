import { useContext, useCallback } from "react";
import { AuthContext } from "../context/Auth";
import useSWR from "swr";
import { useToast } from "@chakra-ui/react";

export default function useResource() {
  const { tokens } = useContext(AuthContext);

  const toast = useToast();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  const fetchResource = useCallback(
    async (url) => {
      if (!tokens) return;
      try {
        const res = await fetch(url, config());
        if (!res.ok) throw new Error("Failed to fetch resource");
        const resJSON = await res.json();
        return resJSON;
      } catch (err) {
        handleError(err);
      }
    },
    [tokens]
  );

  const { data, error, mutate } = useSWR(tokens ? apiUrl : null, fetchResource);

  const config = useCallback(
    () => ({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens?.access}`,
      },
    }),
    [tokens]
  );

  const handleError = useCallback(
    (err) => {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // Optionally: logout();
    },
    [toast]
  );

  const handleSuccess = useCallback(
    (message) => {
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );

  const deleteResource = useCallback(
    async (id,url) => {
      try {
        const url = `${url}/${id}/`;
        const options = config();
        options.method = "DELETE";

        const res = await fetch(url, options);
        if (!res.ok) throw new Error("Failed to delete resource");

        mutate();
        handleSuccess("Resource deleted successfully.");
      } catch (err) {
        handleError(err);
      }
    },
    [config, mutate, handleSuccess, handleError]
  );

  const createResource = useCallback(
    async (url, data) => {
     
      if (!tokens) {
        console.error("Tokens are undefined, cannot create resource.");
        return;
      }
      try {
        const options = config();
        options.method = "POST";
        options.body = JSON.stringify(data);

        const res = await fetch(url, options);
        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorDetails = await res.json();
          throw new Error(`Failed to create resource: ${errorDetails.message}`);
        }

        handleSuccess("Resource created successfully.");
      } catch (err) {
        console.error("Error creating resource:", err);
        handleError(err);
      }
    },
    [tokens, handleError, handleSuccess]
  );

  const updateResource = useCallback(
    async (data,url) => {
      if (!tokens) return;
      try {
        const url = `${url}/${data.id}/`;
        const options = config();
        options.method = "PATCH";
        options.body = JSON.stringify(data);

        const res = await fetch(url, options);
        if (!res.ok) throw new Error("Failed to update resource");

        mutate();
        handleSuccess("Resource updated successfully.");
      } catch (err) {
        handleError(err);
      }
    },
    [ config, mutate, handleSuccess, handleError, tokens]
  );

  return {
    resource: data,
    deleteResource,
    createResource,
    updateResource,
    loading: !!tokens && !error && !data,
  };
}
