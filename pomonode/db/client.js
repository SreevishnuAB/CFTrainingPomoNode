const hdbext = require('@sap/hdbext');

const hanaConfig = {
  host: process.env.HDB_HOST,
  port: process.env.HDB_PORT,
  sslValidateCertificate: false,
  encrypt: true,
  user: process.env.HDB_USER,
  password: process.env.HDB_PWD
}

const executeSQL = (sql) => {
  return new Promise((resolve, reject) => {
    hdbext.createConnection(hanaConfig, (error, client)=>{
      if(error){
        console.error(error)
        reject(error);
      }
      client.exec(sql, (error, rows)=>{
        if(error){

          console.error(`Error during execution: ${error}`);
          reject(error)
        }

        resolve({"result": "success", "data": rows});
      });
    });
  });
}

module.exports = {"executeSQL": executeSQL};