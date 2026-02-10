module.exports = {
  apps: [
    {
      name: "cryptonest-backend",
      script: "server.js",
      env: {
        PORT: 5000,
        DB_HOST: "127.0.0.1",
        DB_PORT: 5432,
        DB_USER: "cryptonest_user",
        DB_PASSWORD: "Oladimeji", // 🔑 ROTATE immediately
        DB_NAME: "cryptonest",
        DB_SSL: "false",
        JWT_SECRET: "07e2127a0a13a9d3689774c557d002525e5d0ed58639290ad5fb8a01bcc2434b", // replace with your own secret
      },
    },
  ],
};