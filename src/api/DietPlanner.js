import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
});

export const wakeUltimateUtility = async () => {
    await axiosInstance.get("/user/wakeUltUtl");
}

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

export const generateImages = async (query="") => {
    try {
        const response = await axiosInstance.post(`/generate/images`, { query });
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export const generateTitle = async (query="") => {
    try {
        const response = await axiosInstance.post(`/generate/images`, { query });
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export const generateKeywordTitle = async (query="") => {
    try {
        const response = await axiosInstance.post(`/generate/keyword_title`, { query });
        return response.data.data;
    } catch (e) {
        throw new Error(e);
    }
}

export { checkIfLogin };