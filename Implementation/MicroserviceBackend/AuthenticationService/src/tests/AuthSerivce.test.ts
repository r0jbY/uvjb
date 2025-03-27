import { AuthService } from "../services/auth.service";
import { prisma } from "../config/database";

jest.mock("../config/database", () => ({
    prisma: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn()
      },
    },
  }));
  
describe("AuthService.getUserByEmail", () => {
  const mockUser = {
    id: "123",
    email: "user@example.com",
    password: "hashedpass",
    role: "admin",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user if found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await AuthService.getUserByEmail("user@example.com");

    expect(result).toEqual(mockUser);
  });

  it("should return null if no user is found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await AuthService.getUserByEmail("notfound@example.com");

    expect(result).toBeNull();
  });

  it("should throw an error if Prisma throws", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await expect(AuthService.getUserByEmail("user@example.com")).rejects.toThrow("Internal Server Eroor");

    consoleSpy.mockRestore();
  });
});

describe("AuthService.createAccount", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const email = "r@gmail.com";
  const password = "hashedPass";
  const id = "uuid";
  const role = "admin";

  it("should return true if account is created", async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue({user : "user"});

    const result = await AuthService.createAccount(email, password, id, role);

    expect(result).toBe(true);
  });

  it("should throw an error if Prisma can't create an account", async () => {
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error("Db error"));

    await expect(AuthService.createAccount(email, password, id, role)).rejects.toThrow("User could not be created");
  }) 



})

