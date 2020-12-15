export function timeout() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.status));
}

export function toJson(response) {
  return response.json();
}
