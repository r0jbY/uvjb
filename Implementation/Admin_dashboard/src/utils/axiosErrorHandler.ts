import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): never => {
  if (error && typeof error === "object" && "isAxiosError" in error && (error as any).isAxiosError) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      throw new Error("Unable to reach server. Please check your connection.");
    }

    // Use server error message if provided
    const serverMessage = axiosError.response.data as { message?: string };
    console.log(serverMessage);
    throw new Error(serverMessage?.message || "Request failed.");
  }

  throw new Error("An unexpected error occurred.");
};
