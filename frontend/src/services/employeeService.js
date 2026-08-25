const API_BASE_URL = "/api";

export const AUTH_TOKEN_KEY = "picstart_auth_token";

function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response) {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || `A API respondeu com o status ${response.status}.`);
  }

  return body;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    window.dispatchEvent(new Event("picstart:unauthorized"));
  }

  return parseResponse(response);
}

export async function loginEmployee(email, password) {
  const response = await fetch(`${API_BASE_URL}/employee/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(response);
}

export function logoutEmployee() {
  return apiRequest("/employee/logout", { method: "POST" });
}

export function getEmployees() {
  return apiRequest("/employee/get");
}

export function searchEmployees(filters) {
  const params = new URLSearchParams();

  if (filters.name) {
    params.set("name", filters.name);
  }

  if (filters.post) {
    params.set("post", filters.post);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return apiRequest(`/employee/search?${params.toString()}`);
}

export function getIndicators() {
  return apiRequest("/employee/indicators");
}

export async function getEmployeeById(id) {
  const employee = await apiRequest(`/employee/get/${id}`);

  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  return employee;
}

export function createEmployee(employee) {
  return apiRequest("/employee/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
}

export function updateEmployee(id, employee) {
  return apiRequest(`/employee/put/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
}

export function updateEmployeePartial(id, employee) {
  return apiRequest(`/employee/patch/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
}

export function deleteEmployee(id) {
  return apiRequest(`/employee/delete/${id}`, { method: "DELETE" });
}
