export const config = {
  postgres: {
    db: getRequiredEnvironmentVariable("POSTGRES_DB"),
    user: getRequiredEnvironmentVariable("POSTGRES_USER"),
    password: getRequiredEnvironmentVariable("POSTGRES_PASSWORD"),
  },
};

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`${name} must be defined.`);
  }
  return value;
}
