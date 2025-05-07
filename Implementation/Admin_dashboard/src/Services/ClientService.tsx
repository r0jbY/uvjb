import axios from "../axiosConfigs";
import { handleAxiosError } from "../utils/axiosErrorHandler";

export const getClients = async (page: number) => {
  try {
    const res = await axios.get(`clients/getAll?offset=${page * 20}&limit=20`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

};

export const getClient = async (id: string) => {
  try {
    const res = await axios.get(`clients/full/${id}`, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

};

export const searchClients = async (searchTerm: string, limit?: number) => {
  try {
    console.log("We are here!")
    const res = await axios.get('/clients/search', {
      params: {
        query: searchTerm,
        limit: limit || 0
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    handleAxiosError(error);

  }
};

export const searchSuperbuddies = async (searchTerm: string) => {
  try {
    const res = await axios.get('/users/searchSuperbuddies', {
      params: {
        query: searchTerm,
        limit: 5
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

interface Client {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  deviceCode : string,
  superbuddyId: string
  active: boolean;
}

export const createClient = async (clientData: Client) => {
  try {

    const response = await axios.post("/clients/register", clientData); // <- update this URL
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export const editClient = async (clientData: Client, id: string) => {
  try {

    const response = await axios.put(`/clients/update/${id}`, clientData); // <- update this URL
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export const deleteClient = async (id: string) => {
  try {

    const response = await axios.delete(`/clients/delete/${id}`); // <- update this URL
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

