mysql = require('mysql');
conn = mysql.createConnection({
  host: 'web2.cpsc.ucalgary.ca',
  user: 's513_sjdixon',
  password: '10037023',
  database: 's513_sjdixon'
});

conn.connect();
//var query = "SELECT table_schema, table_name, column_name "
//+ "FROM information_schema.columns WHERE 'table_schema' != ‘mysql’ "
//+ "AND table_schema != ‘information_schema’";
//+ "AND table_name = 'Photoes'";

var query = 'SELECT * FROM Photoes';
conn.query(query, function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ' + JSON.stringify(rows[0]));
});

conn.end();

