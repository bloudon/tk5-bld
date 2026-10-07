// PM2 process config for Team K5
// Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps: [
    {
      name: "k5-api",
      script: "./artifacts/api-server/dist/index.mjs",
      interpreter: "node",
      // Keep one instance: ALTCHA uses an atomic, process-local challenge store.
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOST: "127.0.0.1",
      },
      // Restart if memory exceeds 512 MB
      max_memory_restart: "512M",
      // Keep logs tidy
      out_file: "./logs/k5-api-out.log",
      error_file: "./logs/k5-api-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
