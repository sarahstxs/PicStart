package com.example.picstart.demo.controller;


import org.springframework.stereotype.Service;

import com.example.picstart.demo.models.Employee;
// import com.fasterxml.jackson.annotation.JacksonAnnotation;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class employeeService {


    private List<Employee> employee = new ArrayList<>();
    

    public employeeService(){
        employee.add(new Employee (1, "Renan Santos de Almeida","123", "RenanSantos@picpay.com", "11 95677-5122", "Gerente de projetos", "la", 67.00, "la"));
        employee.add(new Employee (2, "Jair Messias Bolsonaro","DeusPatriaFamilia", "bolsonaro@picpay.com", "11 12345-6789", "la", "la", 67.00, "la"));

    }

    public Employee AddEmployee(Employee newEmployee) {
        newEmployee.setStatus("ACTIVE");
        if (employee.isEmpty()) {
            newEmployee.setId(1);
        }
        else {
            Employee lastRegister = employee.get(employee.size() - 1) ;
            newEmployee.setId(lastRegister.getId() + 1);
        }
        employee.add(newEmployee);
        return employee.get(newEmployee.getId()-1);
        
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
                
                if (partialData.getName() != null) {
                    emp.setName(partialData.getName());
                }
                
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
    
}

