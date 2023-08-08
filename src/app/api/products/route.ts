import { NextResponse } from "next/server";
import * as Products from "@/database/products";
import { ServerError } from "@/lib/error";
import parseOptions from "@/util/parseOptions";

export const GET = async (request: Request): Promise<Response> => {
  const options = parseOptions(request.url);
  const brand = await Products.getProducts(options);
  if (brand instanceof ServerError) {
    const response = new Response(brand.message, {
      status: brand.status,
    });
    return response;
  }
  return NextResponse.json(brand);
};

export const POST = async (request: Request): Promise<Response> => {
  const { userId, modelId, price, pictures, description } =
    await request.json();
  const product = await Products.createProduct({
    userId,
    modelId,
    price,
    description,
    pictures,
  });
  if (product instanceof ServerError) {
    const response = new Response(product.message, {
      status: product.status,
    });
    return response;
  }
  return NextResponse.json(product);
};