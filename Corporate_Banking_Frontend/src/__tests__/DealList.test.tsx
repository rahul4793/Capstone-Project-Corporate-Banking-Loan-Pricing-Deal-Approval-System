import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DealList from "../features/deals/DealList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import * as dealApi from "../api/dealApi";

/* ================= MOCK API ================= */
vi.mock("../api/dealApi", () => ({
  getAllDeals: vi.fn(),
  deleteDeal: vi.fn(),
  updateDealStage: vi.fn(),
  addDealNote: vi.fn(),
}));

/* ================= MOCK DATA ================= */
const mockDeals = [
  {
    id: "1",
    clientName: "ABC Corp",
    dealType: "M&A",
    sector: "IT",
    currentStage: "Prospect",
    dealValue: 1000,
    notes: [],
  },
];

/* ================= RENDER HELPER ================= */
const renderDealList = (role: "USER" | "ADMIN") => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        token: "token",
        username: "test",
        role,
        active: true,
        loading: false,
        error: null,
      },
    },
  });

  render(
    <Provider store={store}>
      <DealList />
    </Provider>
  );
};

/* ================= TESTS ================= */
describe("DealList Component (stable tests)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dealApi.getAllDeals as any).mockResolvedValue(mockDeals);
  });

  /* ---------- Load & Render ---------- */
  it("loads and displays deals", async () => {
    renderDealList("USER");

    await waitFor(() => {
      expect(screen.getByText("ABC Corp")).toBeInTheDocument();
    });

    expect(screen.getByText("M&A")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
  });

  /* ---------- Notes Dialog ---------- */
  it("opens notes dialog and adds a note", async () => {
    renderDealList("USER");

    await waitFor(() => {
      expect(screen.getByText("ABC Corp")).toBeInTheDocument();
    });

    /* Click Notes icon (IconButton has no text) */
    const notesIcon = screen.getAllByTestId("NotesIcon")[0];
fireEvent.click(notesIcon.closest("button")!);

expect(
  await screen.findByRole("heading", { name: "Notes" })
).toBeInTheDocument();



    /* VERY IMPORTANT:
       Notes TextField is rendered as <textarea> in Dialog */
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();

    fireEvent.change(textarea, {
      target: { value: "New note added" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /add note/i })
    );

    await waitFor(() => {
      expect(dealApi.addDealNote).toHaveBeenCalled();
    });
  });

  /* ---------- Stage Change ---------- */
  it("updates deal stage", async () => {
    renderDealList("USER");

    await waitFor(() => {
      expect(screen.getByText("ABC Corp")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByDisplayValue("Prospect"),
      { target: { value: "Closed" } }
    );

    await waitFor(() => {
      expect(dealApi.updateDealStage).toHaveBeenCalled();
    });
  });

  /* ---------- Edit Dialog ---------- */
  it("opens edit deal dialog", async () => {
    renderDealList("USER");

    await waitFor(() => {
      expect(screen.getByText("ABC Corp")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));

    expect(
      screen.getByText(/edit deal/i)
    ).toBeInTheDocument();
  });

  /* ---------- Delete Flow (ADMIN) ---------- */
  it("ADMIN deletes a deal", async () => {
    renderDealList("ADMIN");

    await waitFor(() => {
      expect(screen.getByText("ABC Corp")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    expect(
      screen.getByText(/delete deal/i)
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Delete" })
    );

    await waitFor(() => {
      expect(dealApi.deleteDeal).toHaveBeenCalled();
    });
  });
});
