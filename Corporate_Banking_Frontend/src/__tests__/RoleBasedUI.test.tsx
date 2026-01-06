import { screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { store } from "../app/store";
import DealForm from "../features/deals/DealForm";
import { renderWithProviders } from "./test-utils";

describe("Role based UI", () => {
  test("deal value hidden for USER", () => {
    store.dispatch({
      type: "auth/login/fulfilled",
      payload: {
        token: "t",
        username: "user",
        role: "USER",
        active: true,
      },
    });

    renderWithProviders(<DealForm onSuccess={() => {}} />);

    expect(
      screen.queryByLabelText(/deal value/i)
    ).not.toBeInTheDocument();
  });
});
