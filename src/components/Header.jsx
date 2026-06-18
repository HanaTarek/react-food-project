import { use } from 'react';
import logo from '../assets/logo.jpg';
import Button from './ui/Button';
import CartContext from '../store/CartContext';
import UserProgressContext from "../store/UserProgressContext.jsx";

export default function Header() {

    const {items} = use(CartContext);

    const userProgressCtx = use(UserProgressContext);

    function handleShowCart() {
    userProgressCtx.showCart();
    }

    const itemsSize = items.reduce((totalQuantity , item ) =>{
        return totalQuantity + item.quantity ; 
    },0);

  return (
    <header id="main-header">
      
      <div id="title">
        <img src={logo} alt="Food Order App Logo" />
        <h1>ReactFood</h1>
      </div>

      <nav>
        <Button textonly  onClick={handleShowCart}>Cart ({itemsSize})</Button>
      </nav>

    </header>
  );
}
