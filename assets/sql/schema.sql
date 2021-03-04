DROP DATABASE IF EXISTS employeeManager;

CREATE DATABASE employeeManager;

USE employeeManager;

CREATE TABLE deps (
	department_id INT auto_increment,
    Department VARCHAR(20),
    PRIMARY KEY(department_id)
);

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT, 
    PRIMARY KEY (role_id),
    Title VARCHAR(30) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES deps(department_id)
);

CREATE TABLE employees (
	id INT auto_increment,
    PRIMARY KEY (id),
    First_name VARCHAR(20) NOT NULL,
    Last_name VARCHAR(20) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    Manager INT NULL,
    FOREIGN KEY (Manager) REFERENCES employees(id)
);