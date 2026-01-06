import axiosInstance from "./axiosInstance";

// GET ALL DEALS
export const getAllDeals = async () => {
  const response = await axiosInstance.get("/api/deals");
  return response.data;
};

// GET DEAL BY ID
export const getDealById = async (id: string) => {
  const response = await axiosInstance.get(`/api/deals/${id}`);
  return response.data;
};

// CREATE DEAL
export const createDeal = async (deal: any) => {
  const response = await axiosInstance.post("/api/deals", deal);
  return response.data;
};

// UPDATE BASIC DEAL
export const updateDeal = async (id: string, deal: any) => {
  const response = await axiosInstance.put(`/api/deals/${id}`, deal);
  return response.data;
};

//  UPDATE STAGE
export const updateDealStage = async (id: string, stage: string) => {
  const response = await axiosInstance.patch(`/api/deals/${id}/stage`, {
    stage,
  });
  return response.data;
};

//  ADD NOTE
export const addDealNote = async (id: string, note: string) => {
  const response = await axiosInstance.post(`/api/deals/${id}/notes`, {
    note,
  });
  return response.data;
};

//  UPDATE DEAL VALUE (ADMIN)
export const updateDealValue = async (id: string, dealValue: number) => {
  const response = await axiosInstance.patch(`/api/deals/${id}/value`, {
    dealValue,
  });
  return response.data;
};

// DELETE DEAL (ADMIN)
export const deleteDeal = async (id: string) => {
  const response = await axiosInstance.delete(`/api/deals/${id}`);
  return response.data;
};
