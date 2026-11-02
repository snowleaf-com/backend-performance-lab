import http from "k6/http";
import { check, sleep } from "k6";

/**
 * Phase 0: GET /orders の最小負荷シナリオ（localhost 限定）。
 * 使い方: k6 run load-tests/orders.js
 */
export const options = {
  vus: 5,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:3000";

export default function () {
  const res = http.get(`${BASE_URL}/orders?userId=123`);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "has orders array": (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.orders);
      } catch {
        return false;
      }
    },
  });
  sleep(0.2);
}
