import axios from "../axiosConfigs";
import * as Axios from "axios";

export const getUsers = async (page: number) => {
    try{
        const res = await axios.get(`users?offset=${page * 20}&limit=20`);
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
      return [];
    }
  };

