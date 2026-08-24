package com.example.picstart.demo.controller;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

import com.example.picstart.demo.models.Employee;
// import com.fasterxml.jackson.annotation.JacksonAnnotation;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class employeeService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private List<Employee> employee = new ArrayList<>();
    

    public employeeService(){
        employee.add(new Employee (1, "Renan Santos de Almeida","123", "RenanSantos@picpay.com", "11 95677-5122", "Director", "TI", 20000, "São Paulo", "HIRED"));
        employee.add(new Employee (2, "Jair Messias Bolsonaro","DeusPatriaFamilia", "bolsonaro@picpay.com", "11 12345-6789", "Director", "TI", 60000, "São Paulo", "UNDER REVIEW"));
        employee.add(new Employee (3, "Guilherme Brandão","123", "Gui@picpay.com", "11 99999-9999", "Director", "TI", 90000, "TI", "REJECTED"));
        employee.add(new Employee (3, "Rebecca Sarah Duarte Paulucci","Rebecca@01", "becca@picpay.com", "11 34577-5246","Systems Analyst", "TI", 10000, "São Paulo", "HIRED"));
        employee.add(new Employee (3, "João Pedro Cappeli","Jojo@123", "jojo@picpay.com", "11 0000-0000","Systems Analyst", "TI", 5000, "São Paulo", "UNDER REVIEW"));

    }

    public Employee AddEmployee(Employee newEmployee) {
        newEmployee.setStatus("ACTIVE");
        if (employee.isEmpty()) {
            newEmployee.setId(1);
        }
        else {
            int nextId = employee.stream()
                    .mapToInt(Employee::getId)
                    .max()
                    .orElse(0) + 1;
            newEmployee.setId(nextId);
        }
        employee.add(newEmployee);
        return newEmployee;
        
    }

    public List<Employee> listEmployees(){
        return employee;
    }

    public Employee listOneEmployee(int id){
        for (Employee emp : employee) {
            if (emp.getId() == id){
                return emp;
            }
        }
        return null;
    }

    public boolean deleteEmployee(int id){
        return employee.removeIf(emp -> emp.getId() == id);

    }

    public Employee partialUpdate(int id, Employee partialData) {
        for (Employee emp : employee) {
            if (emp.getId() == id) {
                
                if (partialData.getEmail() != null) {
                    emp.setEmail(partialData.getEmail());
                }
                
                if (partialData.getPhone() != null) {
                    emp.setPhone(partialData.getPhone());
                }
                
                if (partialData.getStatus() != null) {
                    emp.setStatus(partialData.getStatus());
                }
                
                if (partialData.getPost() != null) {
                    emp.setPost(partialData.getPost());
                }
                
                if (partialData.getDepartment() != null) {
                    emp.setDepartment(partialData.getDepartment());
                }
                
                if (partialData.getSalary() != 0.0) {
                    emp.setSalary(partialData.getSalary());
                }
                
                if (partialData.getCity() != null) {
                    emp.setCity(partialData.getCity());
                }

                if (partialData.getAdmin() != null){
                    emp.setAdmin(partialData.getAdmin());
                }

                return emp; 
            }
        }
        return null;
    }

    public Employee totalUpdate(int id, Employee totalData){
        for (Employee emp: employee){
            if (emp.getId() == id) {
                if (emp.getId() == id){
                    emp.setName(totalData.getName());
                    emp.setEmail(totalData.getEmail());
                    emp.setPhone(totalData.getPhone());
                    emp.setPost(totalData.getPost());
                    emp.setDepartment(totalData.getDepartment());
                    emp.setSalary(totalData.getSalary());
                    emp.setCity(totalData.getCity());
                    emp.setStatus(totalData.getStatus());
                    emp.setAdmin(totalData.getAdmin());

                    return emp;
                }
            }
        }
        return null;
    }

    public boolean login(String email, String password) {
        for (Employee emp: employee){
            if (emp.getEmail().equals(email)){
                boolean acces = encoder.matches(password, emp.getPassword());
                return acces;
                
            }else{
                return false;
            }
            }
        return false;
    }

    public List<Employee> search(String search){
        List<Employee> founds = new ArrayList<>();

        for (Employee emp: employee){
            if (emp.getName().toLowerCase().contains(search.toLowerCase())){
                founds.add(emp);
            }
        }
        return founds;
    }

    public Map<String, Integer> indicators() {

        Map<String, Integer> indicators = new HashMap<>();

        indicators.put("UNDER REVIEW", indicators.getOrDefault("UNDER REVIEW", 0));
        indicators.put("APPROVED", indicators.getOrDefault("APPROVED", 0));
        indicators.put("REJECTED", indicators.getOrDefault("REJECTED", 0));
        indicators.put("HIRED", indicators.getOrDefault("HIRED", 0));
        
        // Under review; Approved; Rejected; Hired.
        for (Employee emp: employee){
            switch (emp.getStatus()){
                case "UNDER REVIEW":
                    indicators.put("UNDER REVIEW", indicators.getOrDefault("UNDER REVIEW", 0) + 1);
                    break;
                case "APPROVED":
                    indicators.put("APPROVED", indicators.getOrDefault("APPROVED", 0) + 1);
                    break;
                case "REJECTED":
                    indicators.put("REJECTED", indicators.getOrDefault("REJECTED", 0) + 1);
                    break;
                case "HIRED":
                    indicators.put("HIRED", indicators.getOrDefault("HIRED", 0) + 1);
                    break;
                default:
            }
        }
        return indicators;
    }
}
