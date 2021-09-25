const get = (key: string) => {
  return process.env[key];
};

export default () => ({
  database: {
    host: get('DATABASE_HOST') ?? '',
    user: get('DATABASE_USER') ?? '',
    name: get('DATABASE_NAME') ?? '',
    password: get('DATABASE_PASSWORD') ?? '',
    port: get('DATABASE_PORT') ?? '',
    schema: get('DATABASE_SCHEMA') ?? '',
  },
  port: get('PORT') ?? 3000,
});
