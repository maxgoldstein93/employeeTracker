require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.DB_PASS,
  database: "employeeTracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
 displayMenu();
});

const displayMenu = () => {
	inquirer.prompt([
		{
			name: "menuChoice",
			type: "list",
			choices: ["View departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "EXIT"],
			message: "Please choose a menu option:"
		}
	]).then(({ menuChoice }) => {
		switch(menuChoice) {
			case "View departments":
				viewDepartment();
				break;
			case "View Roles":
				viewRoles();
        break;
      case "View Employees":
        viewEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
        case "Add Role":
          addRole();
          break;
			default:
				connection.end();
		}
	});
};

function viewDepartment(){
  connection.query("SELECT * FROM department", function(err, depData) {
		if(err)
			throw err;
      depData.map(item => console.log(item.name));
      displayMenu();
     
  });
}

function viewRoles(){
  connection.query("SELECT * FROM role", function(err, roleData) {
		if(err)
			throw err;
      roleData.map(item => console.log(`Role: ${item.title} | Salary $${item.salary} | Department ID: ${item.department_id}`));
      
      displayMenu();
     
  });
}

function viewEmployees(){
  connection.query("SELECT * FROM employee", function(err, employeeData) {
		if(err)
      throw err;
      
      employeeData.map(function(item){
        if(item.manager_id === null){
          item.manager_id = "";
        }
        console.log(`Name: ${item.first_name} ${item.last_name} | Role ID: ${item.role_id} | Manager ID:${item.manager_id}`);

      });
      
      displayMenu();
  });


}
const addDepartment = () =>{
  inquirer.prompt(
    {
      name: "addDepartment",
      type: "input",
      message: "Please add a new Department"
    }
  ).then(deptAnswers =>{
    connection.query("INSERT INTO department(name) VALUES (?);",  deptAnswers.addDepartment, function(err, res){
      if(err)
        throw err;
    });
    displayMenu();
  });

};

const addRole = () =>{
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
    }
  ]

  ).then(roleAnswers =>{
    connection.query("INSERT INTO role(title, salary) VALUES (?,?);",  [roleAnswers.addRole, roleAnswers.addSalary], function(err, res){
      if(err)
        throw err;
    });
    displayMenu();

    
  })
}

  

