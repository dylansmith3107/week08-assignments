import { db } from "@/utils/dbConnection";
import Link from "next/link";
import homePageStyles from "./homePage.module.css";

export default async function HomePage() {
  const { rows } = await db.query(`SELECT * FROM food_type`);
  console.log(rows);

  return (
    <>
      <main>
        <section className={homePageStyles.welcome}>
          <h2>Welcome</h2>
          <p>
            This is Bake It Easy, a place where you can view bakery recipes for
            all different types of delicious treats! Click on the one of the
            food categories below to view all available recipes for that
            category, then simply click on the desired recipe to see the
            intructions. At the bottom of the recipe page, you can view all
            comments and feedback from our lovely users, feel free to add your
            own!
          </p>
        </section>
        <section className={homePageStyles.foodTypeSection}>
          {rows.map((row) => {
            return (
              <div className={homePageStyles.foodType} key={row.id}>
                <Link
                  className={homePageStyles.foodTypeLinks}
                  href={`/${row.id}`}
                >
                  {row.food_type_name}
                </Link>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
