/**
 * Payments API Service
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ Endpoint             │ Method │ Path                          │
 * ├──────────────────────┼────────┼───────────────────────────────┤
 * │ Initiate Payment     │ POST   │ /payments                     │
 * │ Get Payment Status   │ GET    │ /payments/:id                 │
 * │ Verify Payment       │ POST   │ /payments/:id/verify          │
 * └──────────────────────┴────────┴───────────────────────────────┘
 */

import { apiClient } from "./client";
import type {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentStatusResponse,
} from "./types";

// ─── Public API ──────────────────────────────────────────────

export const paymentsApi = {
  initiate: (data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
    return apiClient<InitiatePaymentResponse>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
      service: "tenant",
    });
  },

  getStatus: (paymentId: string): Promise<PaymentStatusResponse> => {
    return apiClient<PaymentStatusResponse>(`/payments/${paymentId}`, {
      service: "tenant",
    });
  },

  verify: (paymentId: string): Promise<PaymentStatusResponse> => {
    return apiClient<PaymentStatusResponse>(`/payments/${paymentId}/verify`, {
      method: "POST",
      service: "tenant",
    });
  },

  verifyByRequestId: (requestId: string): Promise<PaymentStatusResponse> => {
    return apiClient<PaymentStatusResponse>(`/payments/request/${requestId}/verify`, {
      method: "POST",
      service: "tenant",
    });
  },
};
