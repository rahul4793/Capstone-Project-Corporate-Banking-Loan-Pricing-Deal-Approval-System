import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/api/admin/users");
  return res.data;
};

export const createUser = async (user: any) => {
  const res = await axiosInstance.post("/api/admin/users", user);
  return res.data;
};

export const updateUserStatus = async (id: string, active: boolean) => {
  await axiosInstance.put(`/api/admin/users/${id}/status`, { active });
};
