import { AxiosError } from "axios";

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as Record<string, unknown>).isAxiosError === true;
}

export const handleAxiosError = (error: unknown): never => {
  if (isAxiosError(error)) {
    if (!error.response) {
      throw new Error("Unable to reach server. Please check your connection.");
    }
    // Use server error message if provided
    const serverMessage = error.response.data as { message?: string };
    console.log(serverMessage);
    throw new Error(serverMessage?.message || "Request failed.");
  }

  throw new Error("An unexpected error occurred.");
};
