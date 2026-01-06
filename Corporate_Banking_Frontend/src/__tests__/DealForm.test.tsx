import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DealForm from "../features/deals/DealForm";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import * as dealApi from "../api/dealApi";

// ✅ Mock APIs
vi.mock("../api/dealApi", () => ({
  createDeal: vi.fn(),
  updateDeal: vi.fn(),
  updateDealValue: vi.fn(),
}));

const renderForm = (
  role: "USER" | "ADMIN",
  deal?: any
) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        token: "t",
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
      <DealForm deal={deal} onSuccess={vi.fn()} />
    </Provider>
  );
};

describe("DealForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("USER creates a deal", async () => {
    renderForm("USER");

    fireEvent.change(screen.getByLabelText(/client name/i), {
      target: { value: "ABC Corp" },
    });

    // MUI Select
    fireEvent.mouseDown(screen.getByLabelText(/deal type/i));
    fireEvent.click(await screen.findByText("M&A"));

    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "IT" },
    });

    fireEvent.change(screen.getByLabelText(/summary/i), {
      target: { value: "Valid summary text" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create deal/i }));

    await waitFor(() => {
      expect(dealApi.createDeal).toHaveBeenCalled();
    });
  });

  it("ADMIN edits a deal and updates deal value", async () => {
    const deal = {
      id: "1",
      clientName: "Old Client",
      dealType: "M&A",
      sector: "IT",
      summary: "Old summary",
      dealValue: 1000,
    };

    renderForm("ADMIN", deal);

    fireEvent.change(screen.getByLabelText(/summary/i), {
      target: { value: "Updated summary" },
    });

    fireEvent.change(screen.getByLabelText(/deal value/i), {
      target: { value: "2000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update deal/i }));

    await waitFor(() => {
      expect(dealApi.updateDeal).toHaveBeenCalled();
      expect(dealApi.updateDealValue).toHaveBeenCalled();
    });
  });

  it("handles API error gracefully", async () => {
    (dealApi.createDeal as any).mockRejectedValueOnce(
      new Error("API error")
    );

    renderForm("USER");

    fireEvent.change(screen.getByLabelText(/client name/i), {
      target: { value: "Error Case" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/deal type/i));
    fireEvent.click(await screen.findByText("Debt"));

    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "Finance" },
    });

    fireEvent.change(screen.getByLabelText(/summary/i), {
      target: { value: "Error summary text" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create deal/i }));

    await waitFor(() => {
      expect(dealApi.createDeal).toHaveBeenCalled();
    });
  });
});
