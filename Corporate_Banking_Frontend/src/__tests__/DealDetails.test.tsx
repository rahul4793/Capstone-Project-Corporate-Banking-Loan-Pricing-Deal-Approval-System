import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DealDetails from "../features/deals/DealDetails";
import * as dealApi from "../api/dealApi";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

// 🔹 MOCK API
vi.mock("../api/dealApi");

// 🔹 MOCK DEAL
const mockDeal = {
  id: "1",
  clientName: "ABC Corp",
  dealType: "M&A",
  sector: "IT",
  currentStage: "Prospect",
  summary: "Test deal summary",
  dealValue: 1000000,
  notes: [
    {
      note: "Initial discussion",
      timestamp: new Date().toISOString()
    }
  ]
};

// 🔹 RENDER WITH REDUX
const renderWithRole = (role: "ADMIN" | "USER") => {
  const store = configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: {
        username: "test",
        role,
        token: "dummy",
        loading: false,
        active: true,
        error: null
      }
    }
  });

  return render(
    <Provider store={store}>
      <DealDetails dealId="1" />
    </Provider>
  );
};

describe("DealDetails Component", () => {
  beforeEach(() => {
    vi.spyOn(dealApi, "getDealById").mockResolvedValue(mockDeal as any);
  });

  it("shows loader initially and then renders deal details", async () => {
    renderWithRole("USER");

    // Loader should appear
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for deal data
    await waitFor(() => {
      expect(screen.getByText("ABC Corp")).toBeInTheDocument();
    });

    expect(screen.getByText(/Type: M&A/i)).toBeInTheDocument();

    expect(screen.getByText(/Sector: IT/i)).toBeInTheDocument();

    expect(screen.getByText("Initial discussion")).toBeInTheDocument();
  });

  it("renders deal value only for ADMIN", async () => {
    renderWithRole("ADMIN");

    await waitFor(() => {
      expect(screen.getByText(/₹/)).toBeInTheDocument();
    });
  });
});
