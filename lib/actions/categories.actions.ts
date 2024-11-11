import api from "../api";
import { CategorySchema, CategoryType } from "../definitions";

export const createCategory = async (categoryName: string) => {
  try {
    const response = await api.post(`/category`, categoryName);
    return { response };
  } catch (error) {
    console.error("Error creating category: ", error);
  }
};

export const getCategoryByName = async (name: string) => {
  if (!name) return;

  try {
    const category = await api.get(`/category/name/${name}`);
    return category;
  } catch (error) {
    console.error(error);
  }
};

export const getAllCategories = async (): Promise<CategoryType[]> => {
  try {
    const response = await api.get("/category");
    const categories = response.data;

    const validatedCategories = categories.map((category: CategoryType) =>
      CategorySchema.parse(category)
    );

    return validatedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
