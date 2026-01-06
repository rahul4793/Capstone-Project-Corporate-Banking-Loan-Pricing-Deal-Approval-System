import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "../api/axiosInstance";
import {
  getAllDeals,
  getDealById,
  createDeal,
  updateDeal,
  updateDealStage,
  addDealNote,
  updateDealValue,
  deleteDeal,
} from "../api/dealApi";

// 🔹 Mock axiosInstance
vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("dealApi service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllDeals calls correct endpoint", async () => {
    (axiosInstance.get as any).mockResolvedValue({ data: [] });

    const res = await getAllDeals();

    expect(axiosInstance.get).toHaveBeenCalledWith("/api/deals");
    expect(res).toEqual([]);
  });

  it("getDealById calls correct endpoint", async () => {
    (axiosInstance.get as any).mockResolvedValue({ data: {} });

    await getDealById("1");

    expect(axiosInstance.get).toHaveBeenCalledWith("/api/deals/1");
  });

  it("createDeal calls POST", async () => {
    (axiosInstance.post as any).mockResolvedValue({ data: {} });

    await createDeal({ clientName: "ABC" });

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/api/deals",
      expect.any(Object)
    );
  });

  it("updateDeal calls PUT", async () => {
    (axiosInstance.put as any).mockResolvedValue({ data: {} });

    await updateDeal("1", { sector: "IT" });

    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/api/deals/1",
      expect.any(Object)
    );
  });

  it("updateDealStage calls PATCH", async () => {
    (axiosInstance.patch as any).mockResolvedValue({ data: {} });

    await updateDealStage("1", "Closed");

    expect(axiosInstance.patch).toHaveBeenCalledWith(
      "/api/deals/1/stage",
      { stage: "Closed" }
    );
  });

  it("addDealNote calls POST notes", async () => {
    (axiosInstance.post as any).mockResolvedValue({ data: {} });

    await addDealNote("1", "Note");

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/api/deals/1/notes",
      { note: "Note" }
    );
  });

  it("updateDealValue calls PATCH value", async () => {
    (axiosInstance.patch as any).mockResolvedValue({ data: {} });

    await updateDealValue("1", 1000);

    expect(axiosInstance.patch).toHaveBeenCalledWith(
      "/api/deals/1/value",
      { dealValue: 1000 }
    );
  });

  it("deleteDeal calls DELETE", async () => {
    (axiosInstance.delete as any).mockResolvedValue({ data: {} });

    await deleteDeal("1");

    expect(axiosInstance.delete).toHaveBeenCalledWith("/api/deals/1");
  });
});
