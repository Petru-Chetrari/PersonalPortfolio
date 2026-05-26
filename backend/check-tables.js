const sql = require('mssql/msnodesqlv8');

(async () => {
    try {
        await sql.connect({
            server: 'DESKTOP-31NFAM7',
            database: 'DBMS',
            driver: 'msnodesqlv8',
            options: { trustedConnection: true, trustServerCertificate: true }
        });
        const result = await sql.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
        console.log('Tables in DBMS:', result.recordset);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
