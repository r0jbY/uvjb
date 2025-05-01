import axios from "../axiosConfigs";
import { handleAxiosError } from "../utils/axiosErrorHandler";

export const getUsers = async (page: number) => {
  try {
    const res = await axios.get(`users/getAll?offset=${page * 20}&limit=20`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

};

export const getUser = async (id: string) => {
  try {
    const res = await axios.get(`users/full/${id}`, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }

};

export const searchUsers = async (searchTerm: string) => {
  try {
    const res = await axios.get('/users/search', {
      params: {
        query: searchTerm,
      },
    });
    return res.data;
  } catch (error) {
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



interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: "admin" | "buddy" | "superbuddy" | "";
  active: boolean;
}

export const createUser = async (userData: User) => {
  try {

    const response = await axios.post("/auth/register", userData); // <- update this URL
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export const editUser = async (userData: User, id: string) => {
  try {

    const response = await axios.put(`/users/update/${id}`, userData); // <- update this URL
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export const deleteUser = async (id: string) => {
  try {

    const response = await axios.delete(`/users/delete/${id}`); // <- update this URL
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

