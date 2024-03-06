const argon2 = jest.fn();

argon2.hash = jest.fn();
argon2.verify = jest.fn();

export default argon2;
