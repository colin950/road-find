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
  aws: {
    id: get('ACCESS_KEY_ID') ?? '',
    secret: get('SECRET_ACCESS_KEY') ?? '',
    region: get('REGION') ?? '',
    bucket: get('BUCKET') ?? '',
  },
  gmail: {
    clientId: get('GMAIL_CLIENT_ID') ?? '',
    clientSecret: get('GMAIL_CLIENT_SECRET') ?? '',
    accessToken: get('GMAIL_ACCESS_TOKEN') ?? '',
    refreshToken: get('GMAIL_REFRESH_TOKEN') ?? '',
  },
});
