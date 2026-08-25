package com.example.picstart.demo.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.picstart.demo.models.Employee;
import com.example.picstart.demo.models.LoginResponse;

@Service
public class employeeService {

    private final ArrayList<Employee> employees = new ArrayList<>();
    private final Map<String, String> activeTokens = new ConcurrentHashMap<>();
    private final PasswordEncoder passwordEncoder;

    public employeeService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        seedEmployees();
    }

    public Employee addEmployee(Employee newEmployee) {
        int nextId = employees.stream()
                .mapToInt(Employee::getId)
                .max()
                .orElse(0) + 1;
        newEmployee.setId(nextId);
        newEmployee.setStatus("ACTIVE");
        if (newEmployee.getPassword() != null && !newEmployee.getPassword().isBlank()) {
            newEmployee.setPassword(passwordEncoder.encode(newEmployee.getPassword()));
        }
        employees.add(newEmployee);
        return newEmployee;
    }

    public List<Employee> listEmployees() {
        return employees;
    }

    public Employee listOneEmployee(int id) {
        for (Employee employee : employees) {
            if (employee.getId() == id) {
                return employee;
            }
        }
        return null;
    }

    public boolean deleteEmployee(int id) {
        return employees.removeIf((employee) -> employee.getId() == id);
    }

    public Employee partialUpdate(int id, Employee partialData) {
        Employee employee = listOneEmployee(id);
        if (employee == null) {
            return null;
        }

        if (partialData.getName() != null) {
            employee.setName(partialData.getName());
        }
        if (partialData.getEmail() != null) {
            employee.setEmail(partialData.getEmail());
        }
        if (partialData.getPhone() != null) {
            employee.setPhone(partialData.getPhone());
        }
        if (partialData.getPost() != null) {
            employee.setPost(partialData.getPost());
        }
        if (partialData.getDepartment() != null) {
            employee.setDepartment(partialData.getDepartment());
        }
        if (partialData.getSalary() != null) {
            employee.setSalary(partialData.getSalary());
        }
        if (partialData.getCity() != null) {
            employee.setCity(partialData.getCity());
        }
        if (partialData.getStatus() != null) {
            employee.setStatus(partialData.getStatus());
        }

        return employee;
    }

    public Employee totalUpdate(int id, Employee totalData) {
        Employee employee = listOneEmployee(id);
        if (employee == null) {
            return null;
        }

        employee.setName(totalData.getName());
        employee.setEmail(totalData.getEmail());
        employee.setPhone(totalData.getPhone());
        employee.setPost(totalData.getPost());
        employee.setDepartment(totalData.getDepartment());
        employee.setSalary(totalData.getSalary());
        employee.setCity(totalData.getCity());
        employee.setStatus(totalData.getStatus());
        return employee;
    }

    public List<Employee> search(String name, String post, String status) {
        String normalizedName = normalize(name);
        String normalizedPost = normalize(post);
        String normalizedStatus = normalize(status);

        return employees.stream()
                .filter((employee) -> normalizedName.isEmpty()
                        || normalize(employee.getName()).contains(normalizedName))
                .filter((employee) -> normalizedPost.isEmpty()
                        || normalize(employee.getPost()).contains(normalizedPost))
                .filter((employee) -> normalizedStatus.isEmpty()
                        || normalize(employee.getStatus()).equals(normalizedStatus))
                .toList();
    }

    public Map<String, Integer> indicators() {
        Map<String, Integer> indicators = new HashMap<>();
        indicators.put("TOTAL", employees.size());
        indicators.put("UNDER REVIEW", 0);
        indicators.put("APPROVED", 0);
        indicators.put("REJECTED", 0);
        indicators.put("HIRED", 0);
        indicators.put("ACTIVE", 0);

        for (Employee employee : employees) {
            String status = employee.getStatus();
            indicators.put(status, indicators.getOrDefault(status, 0) + 1);
        }

        return indicators;
    }

    public LoginResponse login(String email, String password) {
        if (email == null || password == null) {
            return null;
        }

        Employee employee = employees.stream()
                .filter((candidate) -> candidate.getEmail() != null
                        && candidate.getEmail().equalsIgnoreCase(email.trim()))
                .findFirst()
                .orElse(null);

        if (employee == null || employee.getPassword() == null
                || !passwordEncoder.matches(password, employee.getPassword())) {
            return null;
        }

        String token = UUID.randomUUID().toString();
        activeTokens.put(token, employee.getEmail());
        return new LoginResponse(token, employee);
    }

    public String findEmailByToken(String token) {
        return token == null ? null : activeTokens.get(token);
    }

    public void logout(String token) {
        if (token != null) {
            activeTokens.remove(token);
        }
    }

    private void seedEmployees() {
        addSeedEmployee(1, "Renan Santos de Almeida", "RenanSantos@picpay.com", "11 95677-5122",
                "Director", "TI", 20000, "São Paulo", "HIRED", "123");
        addSeedEmployee(2, "Jair Messias Bolsonaro", "bolsonaro@picpay.com", "11 12345-6789",
                "Director", "TI", 60000, "São Paulo", "UNDER REVIEW", "DeusPatriaFamilia");
        addSeedEmployee(3, "Guilherme Brandão", "gui@picpay.com", "11 99999-9999",
                "Director", "TI", 90000, "São Paulo", "REJECTED", "123");
        addSeedEmployee(4, "Rebecca Sarah Duarte Paulucci", "becca@picpay.com", "11 34577-5246",
                "Systems Analyst", "TI", 10000, "São Paulo", "HIRED", "123");
        addSeedEmployee(5, "João Pedro Cappeli", "joao@picpay.com", "11 0000-0000",
                "Systems Analyst", "TI", 5000, "São Paulo", "UNDER REVIEW", "123");
        // Login padrão para demonstração
        addSeedEmployee(6, "Admin PicStart", "admin@picstart.com", "11 99999-9999",
                "Admin", "TI", 15000, "São Paulo", "HIRED", "admin");
    }

    private void addSeedEmployee(int id, String name, String email, String phone, String post,
            String department, double salary, String city, String status, String password) {
        Employee employee = new Employee(id, name, email, phone, post, department, salary, city, status);
        employee.setPassword(passwordEncoder.encode(password));
        employees.add(employee);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
