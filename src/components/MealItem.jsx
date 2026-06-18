import { use } from "react";
import { currencyFormatter } from "../util/formatting";
import Button from "./ui/Button";
import CartContext from "../store/CartContext";

export default function MealItem({ meal }) {
    const {addItem} = use(CartContext);

    function handleAddToCart(){
        addItem(meal);
        console.log("meal",meal);

    }



  return (
    <li className="meal-item">

      <article>

        <img
        src={`http://localhost:3000/${meal.image}`}
        alt={meal.name}
        />

        <div>

          <h3>{meal.name}</h3>

          <p className="meal-item-price">
           {currencyFormatter.format(meal.price)}
          </p>

          <p className="meal-item-description">
            {meal.description}
          </p>

        </div>

        <p className="meal-item-actions">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
        </p>

      </article>

    </li>
  );
}