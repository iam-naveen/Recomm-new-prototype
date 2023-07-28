import type { Product } from "@prisma/client";
import client, { matchError } from "./client";
import { ServerError } from "@/lib/error";
import {
  type CreateProductProps,
  type UpdateProductProps,
  createProductValidator,
  updateProductValidator,
} from "@/validation/product";
import { idValidator } from "@/validation/objectId";

export const getProduct = async (
  id: string
): Promise<Product | ServerError> => {
  try {
    const { error } = idValidator.validate(id);
    if (error != null) {
      return new ServerError(error.message, 400);
    }
    const product = await client.product.findUnique({
      where: { id },
      include: {
        model: {
          include: {
            brand: true,
            categories: true,
          },
        },
        room: true,
        buyer: true,
        owner: true,
      },
    });
    if (product == null) {
      return new ServerError("Product not found", 404);
    }
    return product;
  } catch (error) {
    return matchError(
      error,
      "Product",
      `Cannot get the product with id: ${id}`
    );
  }
};

// TODO: check if this function is needed. If not, remove it
export const getProducts = async (): Promise<Product[] | ServerError> => {
  try {
    const allProducts = await client.product.findMany();
    return allProducts;
  } catch (error) {
    return matchError(error, "Products", "Cannot get the products");
  }
};

export const createProduct = async ({
  userId,
  modelId,
  price,
  description,
  pictures,
  duration,
}: CreateProductProps): Promise<Product | ServerError> => {
  const { error } = createProductValidator.validate({
    userId,
    modelId,
    price,
    description,
    pictures,
    duration,
  });
  if (error != null) {
    return new ServerError(error.message, 400);
  }
  try {
    const model = await client.model.findUnique({
      where: {
        id: modelId,
      },
    });
    if (model == null) {
      return new ServerError("Model not found");
    }

    const product = await client.product.create({
      data: {
        model: {
          connect: {
            id: model.id,
          },
        },
        owner: {
          connect: {
            id: userId,
          },
        },
        price,
        description,
        pictures,
        room: {
          create: {
            duration,
          },
        },
      },
    });
    return product;
  } catch (error) {
    return matchError(
      error,
      "Product",
      `Cannot create the product with model id: ${modelId}`
    );
  }
};

export const updateProduct = async ({
  id,
  price,
  images,
}: UpdateProductProps): Promise<Product | ServerError> => {
  const { error } = updateProductValidator.validate({ id, price, images });
  if (error != null) {
    return new ServerError(error.message, 400);
  }
  try {
    const product = await client.product.update({
      where: {
        id,
      },
      data: {
        price,
        pictures: images,
      },
    });
    return product;
  } catch (error) {
    return matchError(
      error,
      "Product",
      `Cannot update the product with id: ${id}`
    );
  }
};

export const deleteProduct = async (
  id: string
): Promise<Product | ServerError> => {
  const { error } = idValidator.validate(id);
  if (error != null) {
    return new ServerError(error.message, 400);
  }
  try {
    const product = await client.product.delete({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    return matchError(
      error,
      "Product",
      `Cannot delete the product with id: ${id}`
    );
  }
};
