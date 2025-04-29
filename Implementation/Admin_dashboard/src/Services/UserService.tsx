import axios from "../axiosConfigs";
import * as Axios from "axios";

export const getUsers = async (page: number) => {
    try{
        const res = await axios.get(`users/getAll?offset=${page * 20}&limit=20`);
        return res.data;
    } catch (error) {
        if (Axios.isAxiosError(error)) {
            if (!error.response) {
                throw new Error("Unable to reach server. Please check your connection.");
            }
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    
};

export const getUser = async (id: string) => {
  try{
      const res = await axios.get(`users/full/${id}`, {withCredentials: true});
      console.log(res.data);
      return res.data;
  } catch (error) {
      if (Axios.isAxiosError(error)) {
          if (!error.response) {
              throw new Error("Unable to reach server. Please check your connection.");
          }
      } else {
          throw new Error("An unexpected error occurred");
      }
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
    } catch (err) {
      console.error('Search failed:', err);
      throw new Error ("Search failed");
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

export const createUser = async (userData : User) => {
  try {

    const response = await axios.post("/auth/register", userData); // <- update this URL
    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error.response.data);
    throw error.response?.data || error.message || "Unknown error";
  }
}

export const editUser = async (userData : User, id: string) => {
  try {

    console.log(id);
    const response = await axios.put(`/users/update/${id}`, userData); // <- update this URL
    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error.response.data);
    throw error.response?.data || error.message || "Unknown error";
  }
}

