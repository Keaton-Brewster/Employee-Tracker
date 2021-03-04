INSERT INTO deps (Department)
VALUES ("Engineering"), ("Legal"), ("Human Resources"), ("Management");

INSERT INTO roles (Title, Salary, department_id)
VALUES ("FullStack Dev", 70000, 1), ("Lead Sales", 50000, 2), ("Manager", 100000, 4);

INSERT INTO employees (First_name, Last_name, role_id, Manager)
VALUES ("Jerry", "Felip", 3, null),
       ("Perry", "Somme", 1, 1),
       ("Som", "Uthor", 2, 1);
