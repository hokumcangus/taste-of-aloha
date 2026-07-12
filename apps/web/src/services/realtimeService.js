import API_BASE_URL from "../config/api.js";

function toHttpBase(apiBaseUrl) {
  if (apiBaseUrl.endsWith("/")) {
    return apiBaseUrl.slice(0, -1);
  }
  return apiBaseUrl;
}

export function createRealtimeStream(onEvent, onError) {
  const token = localStorage.getItem("toa_token");
  const url = new URL(`${toHttpBase(API_BASE_URL)}/api/realtime/stream`);
  if (token) {
    url.searchParams.set("token", token);
  }

  const source = new EventSource(url);

  source.onmessage = (event) => {
    try {
      onEvent(JSON.parse(event.data));
    } catch {
      onEvent(event.data);
    }
  };

  source.addEventListener("order.created", (event) => onEvent(JSON.parse(event.data)));
  source.addEventListener("order.transitioned", (event) => onEvent(JSON.parse(event.data)));
  source.addEventListener("driver.location", (event) => onEvent(JSON.parse(event.data)));

  if (onError) {
    source.onerror = onError;
  }

  return () => source.close();
}
