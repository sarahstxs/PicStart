package com.example.picstart.demo.models;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Employee {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private int id;
    private String name;
    private String password;
    private String email;
    private String phone;
    private String post;
    private String department;
    private double salary;
    private String city;
    private String status;
    private Boolean admin;

    // Constructors
    public Employee (int id, String name,String password, String email, String phone, String post, String department, double salary, String city){
        this.id = id;
        this.name = name;

        String enteredPassword = password;
        String encryptedPssword = encoder.encode(enteredPassword);
        this.password = encryptedPssword;

        this.email = email;
        this.phone = phone;
        this.post = post;
        this.department = department;
        this.salary = salary;
        this.city = city;
        this.status = "ACTIVE";
        this.admin = false;
    }

    // Getters and Setters
    public int getId(){return id;}
    public void setId(int id){this.id = id;}

    public String getName(){return name;}
    public void setName(String name) {this.name = name;}

    public String getPassword(){return password;}

    public String getEmail(){return email;} 
    public void setEmail(String email){this.email = email;}

    public String getPhone() {return phone;}
    public void setPhone(String phone){this.phone = phone;}

    public String getPost(){return post;}
    public void setPost(String post) {this.post = post;}

    public String getDepartment(){return department;}
    public void setDepartment(String department) {this.department = department;}

    public double getSalary() {return salary;}
    public void setSalary(double salary) {this.salary = salary;}

    public String getCity(){return city;}
    public void setCity(String city) {this.city = city;}

    public String getStatus(){return status;}
    public void setStatus(String status){this.status = status;}

    public Boolean getAdmin(){return admin;}
    public void setAdmin(Boolean admin){this.admin = admin;}
}
