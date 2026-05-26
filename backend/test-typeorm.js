const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  database: 'PortfolioDB',
  extra: {
    driver: require('msnodesqlv8'),
  },
  options: {
    encrypt: false,
  },
  requestTimeout: 30000
});

// Since msnodesqlv8 requires connectionString or correct ODBC driver, let's try with connectionString in extra:
const AppDataSource2 = new DataSource({
  type: 'mssql',
  host: 'localhost',
  database: 'PortfolioDB',
  driver: require('mssql/msnodesqlv8'),
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
});

AppDataSource2.initialize().then(() => {
    console.log('Connected to TypeORM using msnodesqlv8 connectionString!');
    process.exit(0);
}).catch(err => {
    console.error('TypeORM connection error:', err);
    process.exit(1);
});
