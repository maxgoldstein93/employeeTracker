DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;


USE employeeTracker_db;

CREATE TABLE department(
    id INT auto_increment NOT NULL,
    name  VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT auto_increment NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
    
);

CREATE TABLE employee(
    id INT auto_increment NOT NULL,
    first_name VARCHAR (30),
    last_name  VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)

);