require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.DB_PASS,
  database: "employeeTracker_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayMenu();
});

const displayMenu = () => {
  inquirer.prompt([
    {
      name: "menuChoice",
      type: "list",
      choices: ["View departments", "View Roles", "View all Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "EXIT"],
      message: "Please choose a menu option:"
    }
  ]).then(({ menuChoice }) => {
    switch (menuChoice) {
      case "View departments":
        viewDepartment();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View all Employees":
        viewALLEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployeeRole()
        break;
      default:
        connection.end();
    }
  });
};

function viewDepartment() {
  connection.query("SELECT * FROM department", function (err, depData) {
    if (err)
      throw err;
    let dept = depData.map(item => item.name);
    console.table("Departments", [dept])
    displayMenu();

  });
}

function viewRoles() {
  connection.query("SELECT role.title, role.salary, department.name from role LEFT JOIN department ON role.department_id = department.id", function (err, roleData) {
    if (err)
      throw err;
    roleData.map(item => console.table(`Role: ${item.title} | Salary $${item.salary} | Department Name: ${item.name}`));

    displayMenu();

  });
}

function viewALLEmployees() {
  connection.query("SELECT role.id, role.title, role.salary, department.name, department.id, employee.first_name, employee.last_name  FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", function (err, employeeData) {
    if (err)
      throw err;
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS role,employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id;",)
    employeeData.map(function (item) {
      if (item.manager_id === null) {
        item.manager_id = "";
      }
      console.log(`Role ID: ${item.id} Name: ${item.first_name} ${item.last_name}| Title: ${item.title} | Department: ${item.name}  Manager:${item.manager_id}`);

    });

    displayMenu();
  });



}
const addDepartment = () => {
  inquirer.prompt(
    {
      name: "addDepartment",
      type: "input",
      message: "Please add a new Department"
    }
  ).then(deptAnswers => {
    connection.query("INSERT INTO department(name) VALUES (?);", deptAnswers.addDepartment, function (err, res) {
      if (err)
        throw err;
    });
    displayMenu();
  });

};

const addRole = () => {

  connection.query("SELECT * FROM department", function (err, depData) {
    if (err)
      throw err;
    let deptName = depData.map(item => item.name);
    let deptId = depData.map(item => item.id);
    console.log(deptName)



    inquirer.prompt([
      {
        name: "addRole",
        type: "input",
        message: "Please add a new Role title:"

      },
      {
        name: "addSalary",
        type: "input",
        message: "Please add Salary:"
      },
      {
        name: "addDepartment",
        type: "list",
        message: "Please select a department",
        choices: deptName

      }

    ]

    ).then(roleAnswers => {
      connection.query("INSERT INTO role(title, salary, department_id ) VALUES (?,?,?);", [roleAnswers.addRole, roleAnswers.addSalary, deptId[deptName.indexOf(roleAnswers.addDepartment)]], function (err, res) {
        if (err)
          throw err;
      });
      displayMenu();

    });
  })
}

function addEmployee() {

  connection.query("SELECT role.title, role.id, employee.first_name, employee.last_name, employee.id AS Employee_ID FROM employee LEFT JOIN role ON employee.role_id = role.id ", function (err, roleData) {
    if (err)
      throw err;
    let roleName = roleData.map(item => item.title);
    let roleId = roleData.map(item => item.id);
    let managerName = roleData.map(item => `${item.first_name} ${item.last_name}`)
    let managerId = roleData.map(item => item.Employee_ID);



    inquirer.prompt([
      {
        name: "addFirstName",
        type: "input",
        message: "Please add first name :"

      },
      {
        name: "addLastName",
        type: "input",
        message: "Please add last name:"
      },
      {
        name: "addRole",
        type: "list",
        message: "Please select a role:",
        choices: roleName

      },
      {
        name: "addManager",
        type: "list",
        message: "Please select a Manager:",
        choices: managerName



      }



    ]
    ).then(employeeAnswers => {
      connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?, ?);",
        [employeeAnswers.addFirstName, employeeAnswers.addLastName, roleId[roleName.indexOf(employeeAnswers.addRole)], managerId[managerName.indexOf(employeeAnswers.addManager)]], function (err, res) {
          if (err)
            throw err;
        });
      displayMenu();


    });
  })

}





