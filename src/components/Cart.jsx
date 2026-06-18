import { use } from "react";
import Modal from "./ui/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./ui/Button";
import UserProgressContext from "../store/UserProgressContext";
import CartItem from "./CartItem";


export default function Cart(){

    const progressctx = use(UserProgressContext);




    const {items , addItem , removeItem } = use(CartContext);

    const cartTotal = items.reduce( (totalPrice , item)=>{
        return totalPrice + item.quantity * item.price ; 
    } , 0)


    function handleCloseCart() {
    progressctx.hideCart();
    }
    function handleOpenCheckout() {
    progressctx.showCheckout();
    }


    return(<Modal open={progressctx.progress === 'cart'} className="cart modal" onClose={progressctx.progress === 'cart' ? handleCloseCart : null}>
        <h2>Your Cart</h2>
      <ul>
        {items.map((item) => (
            <CartItem   
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
              onIncrease={()=>{addItem(item)}}
              onDecrease={()=>{removeItem(item.id)}}
            />
        ))}
      </ul>
      <p className="cart-total">
        {currencyFormatter.format(cartTotal)}
      </p>

      <p className="modal-actions">
        <Button textonly onClick={handleCloseCart} >
          Close
        </Button>

        <Button onClick={handleOpenCheckout} disabled={items.length > 0 ? false : true}>
          Go to Checkout
        </Button>
      </p>


    </Modal>);
}