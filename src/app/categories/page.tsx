import { fetchMajors, fetchSubs } from "@/services/categoryService";
import { CategoryApp } from "@/components/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [initialMajors, initialSubs] = await Promise.all([
    fetchMajors(),
    fetchSubs(),
  ]);

  return (
    <CategoryApp
      initialMajors={initialMajors}
      initialSubs={initialSubs}
    />
  );
}
