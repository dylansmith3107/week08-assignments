import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import recipeIdStyles from "./recipeId.module.css";

export default async function RecipeId({ params }) {
  const { recipeList } = await params;
  const { recipeId } = await params;
  const query = await db.query(`SELECT * FROM recipes WHERE id = $1`, [
    recipeId,
  ]);
  const recipe = query.rows[0];

  const { rows } = await db.query(
    `SELECT comments.id, comments.name, comments.comment, recipes.title FROM comments JOIN recipes ON comments.recipe_id = recipes.id WHERE recipes.id = $1`,
    [recipeId],
  );

  console.log(rows);

  async function handleSubmit(formData) {
    "use server";
    console.log(formData);

    const { commenterName, comment } = {
      commenterName: formData.get("commenterName"),
      comment: formData.get("comment"),
    };
    console.log(commenterName, comment);

    db.query(
      `INSERT INTO comments (name, comment, recipe_id) VALUES ($1, $2, $3)`,
      [commenterName, comment, recipeId],
    );
    revalidatePath(`/${recipeList}/${recipeId}`);
  }
  return (
    <>
      <main className={recipeIdStyles.recipeIdPage}>
        <Link href={`/${recipeId}`}>Go back</Link>
        <section className={recipeIdStyles.recipeSection}>
          <h2>{recipe.title}</h2>
          <h3>By {recipe.author}</h3>
          <p>{recipe.content}</p>
        </section>
        <section className={recipeIdStyles.commentFormSection}>
          <h3>Add a comment:</h3>
          <form className={recipeIdStyles.form} action={handleSubmit}>
            <label className={recipeIdStyles.label} htmlFor="commenterName">
              Name:{" "}
            </label>
            <input
              className={recipeIdStyles.input}
              name="commenterName"
              type="text"
              maxLength={255}
              required
            />
            <label className={recipeIdStyles.label} htmlFor="comment">
              Comment:{" "}
            </label>
            <input
              className={recipeIdStyles.input}
              name="comment"
              type="text"
              required
            />
            <button className={recipeIdStyles.submitButton}>Submit</button>
          </form>
        </section>
        <section className={recipeIdStyles.commentSection}>
          <h3>Comments</h3>
          {rows.map((row) => {
            return (
              <div key={row.id}>
                <p>{row.name} says...</p>
                <p>{row.comment}</p>
                <button
                  onClick={async () => {
                    "use server";

                    db.query(`DELETE FROM comments WHERE id = $1`, [row.id]);

                    revalidatePath(`/${recipeList}/${recipeId}`);
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
