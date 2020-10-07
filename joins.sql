-- Join for view all employee's

USE employeeTracker_db;

SELECT role.title, role.salary, department.name, department.id, employee.first_name, employee.last_name AS DepartmentID 
FROM employee LEFT JOIN
role ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id;


-- join for role
SELECT department.name, role.title, role.salary
FROM role LEFT JOIN
role ON role.id = department_id;



SELECT role.title, role.salary, department.name from role LEFT JOIN department ON role.department_id = department.id