import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
});

const checkIfLogin = async (code) => {
    try {
        const response = await axiosInstance.post("/user/me", { code });
        return response.data.data;
    } catch (e) {
        // alert(e.toString())
        throw new Error({"message": e.details.message});
    }
};

export const addDiet = async (description) => {
    try {
        const response = await axiosInstance.post(`/diets`, { description });
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export const getSuggestions = async () => {
    try {
        const response = await axiosInstance.get(`/suggestions`);
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export const getNames = async () => {
    try {
        const response = await axiosInstance.get(`/names`);
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export const addName = async (name) => {
    try {
        const response = await axiosInstance.post(`/names`, { name });
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export const removeName = async (_id) => {
    try {
        const response = await axiosInstance.delete(`/names/${_id}`);
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export { checkIfLogin };