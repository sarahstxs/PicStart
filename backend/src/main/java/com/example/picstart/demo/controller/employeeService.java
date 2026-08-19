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

    public String deleteEmployee(int id){
        for (Employee emp : employee){
            if (emp.getId() == id) {
                if (emp.getStatus() == "DISABLED") {
                    emp.setStatus("ACTIVE");
                    return "User with ID" + id + " successfully activated!";
                }
                else{
                    emp.setStatus("DISABLED");
                    return "User with ID" + id + " successfully deactivated!";
                }
            }
        }
        return "No user with ID" + id + "found";


    }
}
