class ConfictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);

    this.statusCode = 409;
    this.name = 'ConfictError';
  }
}

module.exports = ConfictError;
