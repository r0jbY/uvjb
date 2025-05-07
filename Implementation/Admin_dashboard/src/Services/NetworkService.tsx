import axios from "../axiosConfigs";
import { handleAxiosError } from "../utils/axiosErrorHandler";

export const getClientNetwork = async (clientId: string, layer: string) => {
  try {
    const res = await axios.get(`network/getAll/${clientId}/${layer}`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

};