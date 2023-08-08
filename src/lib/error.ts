export class ServerError extends Error {
  constructor(
    message: string,
    public status = 500
  ) {
    super(JSON.stringify({ error: message }));
  }
}