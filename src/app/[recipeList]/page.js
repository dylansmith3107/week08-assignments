import Link from "next/link";
import { db } from "@/utils/dbConnection";
import recipeListStyles from "./recipeList.module.css";

export default async function RecipeList({ params, searchParams }) {
  const queryString = await searchParams;

  const { recipeList } = await params;
  const { rows } = await db.query(
    `SELECT recipes.id, recipes.title, recipes.author, food_type.food_type_name FROM recipes JOIN food_type ON recipes.food_type_id = food_type.id WHERE food_type.id = $1`,
    [recipeList],
  );
  console.log(recipeList);
  console.log(rows);

  if (queryString.sort === "desc") {
    rows.sort((a, b) => {
      return b.title.localeCompare(a.title);
    });
  } else if (queryString.sort === "asc") {
    rows.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }
  return (
    <>
      <main className={recipeListStyles.recipeList}>
        <div className={recipeListStyles.sort}>
          <Link href={`/${recipeList}?sort=asc`}>Sort by ascending</Link>
          <Link href={`/${recipeList}?sort=desc`}>Sort by descending</Link>
          <Link href={`/${recipeList}`}>Reset</Link>
        </div>
        {rows.map((row) => {
          return (
            <div className={recipeListStyles.recipeDiv} key={row.id}>
              <Link href={`/${recipeList}/${row.id}`}>{row.title}</Link>
              <h3>By {row.author}</h3>
            </div>
          );
        })}
      </main>
    </>
  );
}
