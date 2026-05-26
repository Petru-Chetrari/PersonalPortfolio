const sql = require('mssql/msnodesqlv8');

async function testConnection() {
    try {
        const config = {
            server: 'localhost',
            database: 'PortfolioDB',
            driver: 'msnodesqlv8',
            options: {
                trustedConnection: true,
                trustServerCertificate: true
            }
        };
        console.log('Connecting...');
        await sql.connect(config);
        console.log('Connected successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

testConnection();
