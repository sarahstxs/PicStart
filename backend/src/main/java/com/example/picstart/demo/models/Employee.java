package com.example.picstart.demo.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Employee {

    private Integer id;
    private String name;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String email;
    private String phone;
    private String post;
    private String department;
    private Double salary;
    private String city;
    private String status;

    public Employee() {
    }

    public Employee(Integer id, String name, String email, String phone, String post,
            String department, Double salary, String city, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.post = post;
        this.department = department;
        this.salary = salary;
        this.city = city;
        setStatus(status);
    }

    public int getId() {
        return id == null ? 0 : id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.toUpperCase();
    }
}
