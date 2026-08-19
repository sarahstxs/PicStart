package com.example.picstart.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.picstart.demo.models.Employee;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/employee")
public class employeeController {

    private final employeeService employeeService;

    public employeeController(employeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/post")
    public Employee addEmployee(@RequestBody Employee newEmployee) {
        return employeeService.AddEmployee(newEmployee);
    }

    @GetMapping("/get/{id}")
    public Employee listOneEmployee(@PathVariable int id) {
        return employeeService.listOneEmployee(id);
    }
    @GetMapping("/get")
    public List<Employee> listEmployees() {
        return employeeService.listEmployees();
    }
    
    @DeleteMapping("/delete/{id}")
    public boolean deleteEmployee(@RequestBody int id) {
        return employeeService.deleteEmployee(id);
    }

    @PatchMapping("/patch/{id}")
    public Employee patialUpdate(@PathVariable int id, @RequestBody Employee partialData){
        return employeeService.partialUpdate(id, partialData);
    }
    @PutMapping("/put/{id}")
    public Employee totalUpdate(@PathVariable int id, @RequestBody Employee partialData){
        return employeeService.partialUpdate(id, partialData);
    }

    @GetMapping("/login")
    public boolean getMethodName(@RequestParam String name, @RequestParam String password) {
        return employeeService.login(name, password);
    }
    
    
}
