import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

// 🔹 MOCK axios.create
vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: {
            use: vi.fn(),
          },
        },
      })),
    },
  };
});

describe("axiosInstance interceptor", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("adds Authorization header when token exists", async () => {
    // Arrange
    localStorage.setItem("token", "test-token");

    // Import AFTER mocking
    const axiosInstance = (await import("../api/axiosInstance")).default;

    const interceptor =
      (axios.create as any).mock.results[0].value.interceptors.request.use;

    // Extract the interceptor function
    const interceptorFn = interceptor.mock.calls[0][0];

    const config = { headers: {} as any };

    // Act
    const result = interceptorFn(config);

    // Assert
    expect(result.headers.Authorization).toBe("Bearer test-token");
  });
});
