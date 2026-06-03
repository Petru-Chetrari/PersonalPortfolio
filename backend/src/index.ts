import app from './app';
import { AppDataSource } from './data-source';

const PORT = Number(process.env['PORT'] ?? 3001);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Portfolio backend running on http://localhost:${PORT}`);
      console.log('Endpoints: /commissions  /projects  /interactions  /health');
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
