import { type Product, type User } from "@prisma/client";
import client, { matchError } from "./client";
import { ServerError } from "@/lib/error";
import { idValidator } from "@/validation/objectId";

export const searchUsers = async (
  query: string
): Promise<User[] | ServerError> => {
  try {
    const users = await client.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return users;
  } catch (error) {
    return matchError(
      error,
      "Users",
      `Cannot search users with query: ${query}`
    );
  }
};

export const getUserByEmail = async (
  email: string
): Promise<User | ServerError> => {
  try {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user == null) {
      return new ServerError(`User with email: ${email} not found`, 404);
    }
    return user;
  } catch (error) {
    return matchError(error, "User", `Cannot find user with email: ${email}`);
  }
};

export const getProductsByUser = async (
  userId: string
): Promise<Product[] | ServerError> => {
  const { error } = idValidator.validate(userId);
  if (error != null) {
    return new ServerError(error.message, 400);
  }
  try {
    const listings = await client.product.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        model: {
          include: {
            brand: true,
            categories: true,
          },
        },
      },
    });
    return listings;
  } catch (error) {
    return matchError(
      error,
      "Listings",
      `Cannot find listings for user with id: ${userId}`
    );
  }
};
