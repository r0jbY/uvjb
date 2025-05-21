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

export const sendNetworkChanges = async (payload: {
  clientId: string;
  addBuddies: string[];
  removeBuddies: string[];
  layer: number;
}) => {
  try {
    const response = await axios.put('/network/update', payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};