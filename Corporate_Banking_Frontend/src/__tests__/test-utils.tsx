import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { store } from "../app/store";

export function renderWithProviders(ui: ReactElement) {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}
