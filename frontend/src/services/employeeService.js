const API_BASE_URL = "/api";

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`A API respondeu com o status ${response.status}.`);
  }

  return response.json();
}

export async function getEmployees() {
  const response = await fetch(`${API_BASE_URL}/employee/get`);

  return parseResponse(response);
}

export async function getEmployeeById(id) {
  const response = await fetch(`${API_BASE_URL}/employee/get/${id}`);
  const employee = await parseResponse(response);

  if (!employee) {
    throw new Error("Funcionário não encontrado.");
  }

  return employee;
}

export async function createEmployee(employee) {
  const response = await fetch(`${API_BASE_URL}/employee/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  return parseResponse(response);
}

export async function updateEmployee(id, employee) {
  const response = await fetch(`${API_BASE_URL}/employee/put/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  return parseResponse(response);
}

export async function deleteEmployee(id) {
  const response = await fetch(`${API_BASE_URL}/employee/delete/${id}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}
