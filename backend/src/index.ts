import app from './app';

const PORT = process.env['PORT'] ?? 3001;

app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
  console.log('Endpoints: /commissions  /projects  /interactions  /health');
});
