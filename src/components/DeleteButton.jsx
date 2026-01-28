import { revalidatePath } from "next/cache";

export default function DeleteButton({ id, recipeListValue, recipeIdValue }) {
  async function handleDelete() {
    "use server";

    db.query(`DELETE FROM comments WHERE id = $1`, [id]);

    revalidatePath(`/${recipeListValue}/${recipeIdValue}`);
  }
  return (
    <>
      <button onClick={handleDelete}>Delete</button>
    </>
  );
}
