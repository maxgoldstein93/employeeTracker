USE employeeTracker_db;

INSERT INTO department(name)VALUES("finance"),("accounting"),("marketing"),("operations management");

INSERT INTO role(title, salary, department_id)VALUES("intern", 40000,1),("associate", 50000, 2);

INSERT INTO employee (first_name, last_name, role_id) VALUES("Max", "G", 1)
