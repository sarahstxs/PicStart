package com.example.picstart.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.picstart.demo.models.Employee;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/employee")
public class employeeController {

    private final employeeService employeeService;

    public employeeController(employeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/post")
    public Employee list(@RequestBody Employee newEmployee) {
        return employeeService.AddEmployee(newEmployee);
    }

    @GetMapping("/get")
    public List<Employee> listEmployees() {
        return employeeService.listEmployees();
    }
    
    @DeleteMapping("/delete")
    public String deleteEmployee(@RequestBody int id) {
        return employeeService.deleteEmployee(id);
    }
    
}
