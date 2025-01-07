const inquirer = require('inquirer').default; 
const queries = require('../db/queries'); 


const viewAllEmployees = async () => {
  try {
    const result = await queries.query(`
      SELECT 
        e.id AS "Employee ID",
        e.first_name AS "First Name",
        e.last_name AS "Last Name",
        r.title AS "Role",
        d.name AS "Department",
        r.salary AS "Salary",
        CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id;
    `);

    if (result.rows.length === 0) {
      console.log('No employees found in the database.');
    } else {
      console.table(result.rows); 
    }
  } catch (err) {
    console.error('Error fetching employees:', err.message);
  }
};


const addEmployee = async () => {
  try {
   
    const rolesResult = await queries.query('SELECT id, title FROM role');
    const roles = rolesResult.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    console.log('Roles:', roles); 

    if (roles.length === 0) {
      console.log('No roles available in the database.');
      return;
    }

    
    const employeesResult = await queries.query('SELECT id, first_name, last_name FROM employee');
    const managers = employeesResult.rows.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));
    managers.unshift({ name: 'None', value: null }); 
    console.log('Managers:', managers);

    
    if (managers.length === 1) {
      console.log('No managers available. Proceeding without assigning a manager.');
    }

    
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
      },
      {
        type: 'list',
        name: 'roleId',
        message: "Select the employee's role:",
        choices: roles,
      },
      {
        type: 'list',
        name: 'managerId',
        message: "Select the employee's manager:",
        choices: managers,
      },
    ]);

   
    await queries.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, roleId, managerId]
    );

    console.log(`Employee ${firstName} ${lastName} added successfully!`);
  } catch (err) {
    console.error('Error adding employee:', err.message);
  }
};


const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'Add an employee',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View all employees':
      console.log('Displaying all employees...');
      await viewAllEmployees(); 
      break;
    case 'Add an employee':
      await addEmployee(); 
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
    default:
      console.log('Option not implemented yet.');
  }

  
  await mainMenu();
};

module.exports = { mainMenu };
