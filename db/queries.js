const { Pool } = require('pg');

const pool = new Pool({
  user: 'nmars',          
  host: 'localhost',       
  database: 'employee_tracker', 
  password: 'Foxlane3671', 
  port: 5432,              
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
