import { useContext, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../context/Auth";

export default function useResource(baseUrl) {
  const { tokens } = useContext(AuthContext);
  const toast = useToast();

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

  const createResource = useCallback(
    async (data) => {
      if (!tokens) {
        console.error("Tokens are undefined, cannot create resource.");
        return;
      }
      try {
        const options = config();
        options.method = "POST";
        options.body = JSON.stringify(data);

        const res = await fetch(baseUrl, options);
        const responseBody = await res.text();

        if (!res.ok) {
          if (res.headers.get("content-type")?.includes("application/json")) {
            const errorDetails = JSON.parse(responseBody);
            throw new Error(`Failed to create resource: ${errorDetails.message}`);
          } else {
            throw new Error("Failed to create resource: Unexpected response format");
          }
        }

        handleSuccess("Resource created successfully.");
      } catch (err) {
        handleError(err);
      }
    },
    [baseUrl, tokens, config, handleError, handleSuccess]
  );

  const updateResource = useCallback(
    async (id, data) => {
      if (!tokens) {
        console.error("Tokens are undefined, cannot update resource.");
        return;
      }
      try {
        const options = config();
        options.method = "PUT";
        options.body = JSON.stringify(data);

        const res = await fetch(`${baseUrl}/${id}`, options);
        const responseBody = await res.text();

        if (!res.ok) {
          if (res.headers.get("content-type")?.includes("application/json")) {
            const errorDetails = JSON.parse(responseBody);
            throw new Error(`Failed to update resource: ${errorDetails.message}`);
          } else {
            throw new Error("Failed to update resource: Unexpected response format");
          }
        }

        handleSuccess("Resource updated successfully.");
      } catch (err) {
        handleError(err);
      }
    },
    [baseUrl, tokens, config, handleError, handleSuccess]
  );

  const deleteResource = useCallback(
    async (id) => {
      if (!tokens) {
        console.error("Tokens are undefined, cannot delete resource.");
        return;
      }
      try {
        const options = config();
        options.method = "DELETE";

        const res = await fetch(`${baseUrl}/${id}`, options);
        const responseBody = await res.text();

        if (!res.ok) {
          if (res.headers.get("content-type")?.includes("application/json")) {
            const errorDetails = JSON.parse(responseBody);
            throw new Error(`Failed to delete resource: ${errorDetails.message}`);
          } else {
            throw new Error("Failed to delete resource: Unexpected response format");
          }
        }

        handleSuccess("Resource deleted successfully.");
      } catch (err) {
        handleError(err);
      }
    },
    [baseUrl, tokens, config, handleError, handleSuccess]
  );

  const getResource = useCallback(
    async (id) => {
      if (!tokens) {
        console.error("Tokens are undefined, cannot retrieve resource.");
        return;
      }
      try {
        const options = config();
        options.method = "GET";

        const res = await fetch(`${baseUrl}/${id}`, options);
        const responseBody = await res.json();

        if (!res.ok) {
          throw new Error(`Failed to retrieve resource: ${responseBody.message}`);
        }

        return responseBody;
      } catch (err) {
        handleError(err);
      }
    },
    [baseUrl, tokens, config, handleError]
  );

  const listResources = useCallback(
    async () => {
      if (!tokens) {
        console.error("Tokens are undefined, cannot list resources.");
        return;
      }
      try {
        const options = config();
        options.method = "GET";

        const res = await fetch(baseUrl, options);
        const responseBody = await res.json();

        if (!res.ok) {
          throw new Error(`Failed to list resources: ${responseBody.message}`);
        }

        return responseBody;
      } catch (err) {
        handleError(err);
      }
    },
    [baseUrl, tokens, config, handleError]
  );

  return {
    createResource,
    updateResource,
    deleteResource,
    getResource,
    listResources,
  };
}
