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
        console.log("Response status:", res.status);
        const responseBody = await res.text();
        console.log("Response body:", responseBody);

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
        console.error("Error creating resource:", err);
        handleError(err);
      }
    },
    [baseUrl, tokens, config, handleError, handleSuccess]
  );

  // Similar methods for `updateResource`, `deleteResource`, etc., can be added here.

  return {
    createResource,
    // Add other methods like `updateResource`, `deleteResource`, etc.
  };
}