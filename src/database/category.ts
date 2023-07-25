import type { Brand, Category, Model, Product } from "@prisma/client";
import client from "./client";
import { ServerError } from "@/util/error";

export const getCategory = async (
  id: string
): Promise<Category | ServerError> => {
  try {
    const category = await client.category.findUnique({
      where: {
        id,
      },
    });
    if (category == null) {
      return new ServerError("Category not found", 404);
    }
    return category;
  } catch (error) {
    return new ServerError(`Cannot get the category with id: ${id}`);
  }
};

// TODO: Implement search sort and pagination functionality
export const getCategories = async (): Promise<Category[] | ServerError> => {
  try {
    const categories = await client.category.findMany();
    return categories;
  } catch (error) {
    return new ServerError("Cannot get the categories");
  }
};

export const createCategory = async (
  name: string,
  picture: string
): Promise<Category | ServerError> => {
  try {
    const category = await client.category.create({
      data: {
        name,
        picture,
      },
    });
    return category;
  } catch (error) {
    return new ServerError(`Cannot create the category with name: ${name}`);
  }
};

export const updateCategory = async (
  id: string,
  name?: string,
  picture?: string
): Promise<Category | ServerError> => {
  try {
    const category = await client.category.update({
      where: {
        id,
      },
      data: {
        name,
        picture,
      },
    });
    return category;
  } catch (error) {
    return new ServerError(`Cannot update the category with id: ${id}`);
  }
};

export const deleteCategory = async (
  id: string
): Promise<Category | ServerError> => {
  try {
    const category = await client.category.delete({
      where: {
        id,
      },
    });

    return category;
  } catch (error) {
    return new ServerError(`Cannot delete the category with id: ${id}`);
  }
};

// TODO: Implement search sort and pagination functionality
export const getModelsByCategory = async (
  id: string
): Promise<Model[] | ServerError> => {
  try {
    const models = await client.model.findMany({
      where: {
        categoryId: id,
      },
    });
    return models;
  } catch (error) {
    return new ServerError(`Cannot get the models with category id: ${id}`);
  }
};

// TODO: Implement search sort and pagination functionality
export const getBrandsByCategory = async (
  id: string
): Promise<Brand[] | ServerError> => {
  try {
    const brands = await client.brand.findMany({
      where: {
        models: {
          some: {
            categoryId: id,
          },
        },
      },
    });

    return brands;
  } catch (error) {
    return new ServerError(`Cannot get the brands with category id: ${id}`);
  }
};

// TODO: Implement search sort and pagination functionality
export const getProductsByCategory = async (
  id: string
): Promise<Product[] | ServerError> => {
  try {
    const products = await client.product.findMany({
      where: {
        model: {
          categoryId: id,
        },
      },
      include: {
        model: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });
    return products;
  } catch (error) {
    return new ServerError(`Cannot get the products with category id: ${id}`);
  }
};
