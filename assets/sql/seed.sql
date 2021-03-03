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

INSERT INTO deps (Department)
VALUES ("Engineering"), ("Sales"), ("Human Resources"), ("Management");

INSERT INTO roles (Title, Salary, department_id)
VALUES ("FullStack Dev", 70000, 1), ("Lead Salesman", 50000, 2), ("Manager", 100000, 4);

INSERT INTO employees (First_name, Last_name, role_id, Manager)
VALUES ("Timmeree", "Estes", 3, null),
       ("Keaton", "Brewster", 1, 1),
       ("Joe", "schmoe", 2, 1);
       
SELECT e.id,e.First_name,e.Last_name,Title,Salary,Department, CONCAT(m.First_name, " ", m.Last_name) as Manager 
FROM employees e
INNER JOIN roles r
ON e.role_id = r.role_id
INNER JOIN deps d
ON r.department_id = d.department_id
LEFT JOIN employees m
ON m.id = e.Manager;
