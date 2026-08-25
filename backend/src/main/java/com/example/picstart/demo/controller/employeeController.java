package com.example.picstart.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.picstart.demo.models.Employee;
import com.example.picstart.demo.models.LoginRequest;
import com.example.picstart.demo.models.LoginResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/employee")
public class employeeController {

    private final employeeService employeeService;

    public employeeController(employeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/post")
    public ResponseEntity<?> addEmployee(@RequestBody Employee newEmployee) {
        if (newEmployee == null || isBlank(newEmployee.getName())
                || isBlank(newEmployee.getEmail()) || isBlank(newEmployee.getPost())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Nome, e-mail e cargo são obrigatórios."));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.addEmployee(newEmployee));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "E-mail e senha são obrigatórios."));
        }

        LoginResponse response = employeeService.login(request.email(), request.password());
        return response == null
                ? ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "E-mail ou senha inválidos."))
                : ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        employeeService.logout(extractToken(authorizationHeader));
        return ResponseEntity.ok(Map.of("message", "Sessão encerrada com sucesso."));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> listOneEmployee(@PathVariable int id) {
        Employee employee = employeeService.listOneEmployee(id);
        return employee == null
                ? notFound()
                : ResponseEntity.ok(employee);
    }

    @GetMapping("/get")
    public List<Employee> listEmployees() {
        return employeeService.listEmployees();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable int id) {
        return employeeService.deleteEmployee(id)
                ? ResponseEntity.ok(Map.of("message", "Funcionário excluído com sucesso."))
                : notFound();
    }

    @PatchMapping("/patch/{id}")
    public ResponseEntity<?> partialUpdate(@PathVariable int id, @RequestBody Employee partialData) {
        if (partialData == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Informe ao menos um campo para atualizar."));
        }

        Employee employee = employeeService.partialUpdate(id, partialData);
        return employee == null
                ? notFound()
                : ResponseEntity.ok(employee);
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<?> totalUpdate(@PathVariable int id, @RequestBody Employee totalData) {
        if (totalData == null || isBlank(totalData.getName())
                || isBlank(totalData.getEmail()) || isBlank(totalData.getPost())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Nome, e-mail e cargo são obrigatórios."));
        }

        Employee employee = employeeService.totalUpdate(id, totalData);
        return employee == null
                ? notFound()
                : ResponseEntity.ok(employee);
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String post,
            @RequestParam(required = false, defaultValue = "") String status) {
        return employeeService.search(name, post, status);
    }

    @GetMapping("/indicators")
    public Map<String, Integer> getIndicators() {
        return employeeService.indicators();
    }

    private ResponseEntity<Map<String, String>> notFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Funcionário não encontrado."));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        return token.isEmpty() ? null : token;
    }
}
