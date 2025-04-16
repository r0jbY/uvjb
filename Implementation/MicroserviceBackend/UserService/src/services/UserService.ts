import { prisma } from "../config/database";

export class UserService {
  
  // ✅ Retrieve user from database
  static async createUser(id: string, first_name: string, last_name: string, phone_number: string, address: string) {
    try {
        await prisma.user.create({
            data: {
              id,
              first_name,
              last_name,
              phone_number,
              address
            }
          });
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Eroor");
    }
  }

  static async getUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch(err) {
      console.log(err);
      throw new Error("Internal Server Eroor");
    }
  }

}
