const inquirer = require("inquirer");
const util = require("util");
// const table = require("console.table");
const db = require("./db/connection");

// Makes queries asynchronous //

db.query = util.promisify(db.query);

// Menu Question //

const firstQuestion = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee's role",
    ],
    name: "response",
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("Please select an option and hit return!");
      }
      return true;
    },
  },
];


function askFirstQuestion() {
  inquirer.prompt(firstQuestion).then(({ response }) => {
    if (response == "View all departments") {
      viewAllDepartments();
    } else if (response == "View all roles") {
      viewAllRoles();
    } else if (response == "View all employees") {
      viewAllEmployees();
    } else if (response == "Add a department") {
      addDepartment();
    } else if (response == "Add a role") {
      addRole();
    } else if (response == "Add an employee") {
      addEmployee();
    } else if (response == "Update an employee's role") {
      updateEmployee();
    }
  });
}

async function viewAllDepartments() {
  try {
    var results = await db.query("SELECT * FROM departments;");
    console.table(results);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}


async function viewAllRoles() {
  try {
    var results = await db.query("SELECT * FROM roles;");
    console.table(results);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}


async function viewAllEmployees() {
  try {
    var results = await db.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.salary, roles.job_title, departments.department_name, managers.first_name AS manager_first_name, managers.last_name AS manager_last_name 
        FROM employees 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN departments ON employees.department_id = departments.id 
        LEFT JOIN employees managers ON employees.manager_id = managers.id;`);
    console.table(results);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}


async function addDepartment() {
  const { department } = await inquirer.prompt([
    {
      type: "input",
      message: "Enter a name for the department you wish to add!",
      name: "department",
      validate: function (answer) {
        if (answer.length < 3) {
          return console.log(
            "Please enter a name for the department you wish to add!"
          );
        }
        return true;
      },
    },
  ]);
  try {
    db.query(
      `INSERT INTO departments (department_name) VALUES ("${department}")`
    );
    console.log(`${department} added to Departments.`);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}


async function addRole() {
  let departments = await db.query("SELECT * FROM departments;");

  let departmentList = departments.map((department) => {
    return { name: department.department_name, value: department.id };
  });

  const { job_title, salary, department_id } = await inquirer.prompt([
    {
      type: "input",
      message: "Enter the job title of the new role you wish to add!",
      name: "job_title",
      validate: function (answer) {
        if (answer.length < 3) {
          return console.log(
            "Please enter the job title of the new role you wish to add!"
          );
        }
        return true;
      },
    },
    {
      type: "input",
      message: "Enter the salary of the new role you wish to add!",
      name: "salary",
      validate: function (answer) {
        if (answer.length < 3) {
          return console.log(
            "Please enter the salary of the new role you wish to add!"
          );
        }
        return true;
      },
    },
    {
      type: "list",
      message: "Select a department for the new role you wish to add!",
      choices: departmentList,
      name: "department_id",
      validate: function (answer) {
        if (!answer) {
          return console.log(
            "Please select a department for the new role you wish to add!"
          );
        }
        return true;
      },
    },
  ]);

  try {
    await db.query(
      `INSERT INTO roles (job_title, salary, department_id) VALUES ("${job_title}", "${salary}", "${department_id}")`
    );
    console.log(`${job_title} added to Roles.`);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}


async function addEmployee() {

  let roles = await db.query("SELECT id, job_title FROM roles;");


  let roleList = roles.map((role) => {
    return { name: role.job_title, value: role.id };
  });


  let departments = await db.query("SELECT * FROM departments;");

  let departmentList = departments.map((department) => {
    return { name: department.department_name, value: department.id };
  });


  let managers = await db.query(
    "SELECT id, first_name, last_name FROM employees;"
  );


  let managerList = managers.map((manager) => {
    return {
      name: manager.first_name + " " + manager.last_name,
      value: manager.id,
    };
  });

  const { first_name, last_name, role_id, department_id, manager_id } =
    await inquirer.prompt([
      {
        type: "input",
        message: "Enter the first name of the employee you wish to add!",
        name: "first_name",
        validate: function (answer) {
          if (answer.length < 2) {
            return console.log(
              "Please enter the first name of the employee you wish to add!"
            );
          }
          return true;
        },
      },
      {
        type: "input",
        message: "Enter the last name of the employee you wish to add!",
        name: "last_name",
        validate: function (answer) {
          if (answer.length < 2) {
            return console.log(
              "Please enter the last name of the employee you wish to add!"
            );
          }
          return true;
        },
      },
      {
        type: "list",
        message: "Select a role for the employee you wish to add!",
        choices: roleList,
        name: "role_id",
        validate: function (answer) {
          if (!answer) {
            return console.log(
              "Please select a role for the employee you wish to add!"
            );
          }
          return true;
        },
      },
      {
        type: "list",
        message: "Select a department for the employee you wish to add!",
        choices: departmentList,
        name: "department_id",
        validate: function (answer) {
          if (!answer) {
            return console.log(
              "Please select a department for the employee you wish to add!"
            );
          }
          return true;
        },
      },
      {
        type: "list",
        message: "Select a manager for the employee you wish to add!",
        choices: managerList,
        name: "manager_id",
        validate: function (answer) {
          if (!answer) {
            return console.log(
              "Please select a manager for the employee you wish to add!"
            );
          }
          return true;
        },
      },
    ]);

  try {
    await db.query(
      `INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id) VALUES ("${first_name}", "${last_name}", "${role_id}", "${department_id}", "${manager_id}");`
    );
    console.log(`${first_name} ${last_name} added to Employees.`);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}


async function updateEmployee() {

  let employees = await db.query(
    "SELECT id, first_name, last_name FROM employees;"
  );


  let employeesList = employees.map((employee) => {
    return {
      name: employee.first_name + " " + employee.last_name,
      value: employee.id,
    };
  });


  let roles = await db.query("SELECT id, job_title FROM roles;");

  let roleList = roles.map((role) => {
    return { name: role.job_title, value: role.id };
  });

  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: "list",
      message: "Choose the employee who's role you wish to update!",
      choices: employeesList,
      name: "employee_id",
      validate: function (answer) {
        if (answer.length < 3) {
          return console.log(
            "Please choose the employee who's role you wish to update!"
          );
        }
        return true;
      },
    },
    {
      type: "list",
      message: "Choose the employee's new role.",
      choices: roleList,
      name: "role_id",
      validate: function (answer) {
        if (answer.length < 3) {
          return console.log("Please choose the employee's new role!");
        }
        return true;
      },
    },
  ]);

  try {
    await db.query(
      `UPDATE employees SET role_id = ("${role_id}") WHERE id = "${employee_id}";`
    );
    console.log(`${employee_id} updated.`);
  } catch (err) {
    console.error(err);
  }
  askFirstQuestion();
}

askFirstQuestion();