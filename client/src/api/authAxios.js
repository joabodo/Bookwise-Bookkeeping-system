import { Clerk } from "@clerk/clerk-js";
import axios from "axios";

const baseURL = process.env.API_URL;

const authAxios = axios.create({
  baseURL,
});

authAxios.interceptors.request.use(async (request) => {
  try {
    // TODO: Update JWT Logic
    const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY);
    await clerk.load();
    request.headers[
      "Authorization"
    ] = `Bearer ${await await clerk.session?.getToken()}`;
  } catch (error) {
    console.error("Error obtaining auth token in interceptor");
  }
  return request;
});

export default authAxios;
