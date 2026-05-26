import { AppDataSource } from './src/data-source';

async function checkDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const tables = await AppDataSource.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`);
    console.log("Tables in DB:", tables.map((t: any) => t.TABLE_NAME));

    const projects = await AppDataSource.query(`SELECT COUNT(*) as count FROM projects`);
    console.log("Projects count:", projects[0].count);

    const commissions = await AppDataSource.query(`SELECT COUNT(*) as count FROM commissions`);
    console.log("Commissions count:", commissions[0].count);

    process.exit(0);
  } catch (err) {
    console.error("Error during Data Source initialization", err);
    process.exit(1);
  }
}

checkDatabase();
