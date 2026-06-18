import Modal from "./ui/Modal";
import UserProgressContext from "../store/UserProgressContext";
import { use , useActionState} from "react";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./ui/Button";
import Input from "./ui/Input";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}
export default function Checkout() {

    const { items , clearCart } = use(CartContext);
    const progressctx = use(UserProgressContext);

   const{ data,
        error,
        sendRequest,
        clearData } = useHttp(`${import.meta.env.VITE_API_URL}/orders`, requestConfig);

    const cartTotal = items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price;
        }, 0);

    
    function handleClose() {
    progressctx.hideCheckout();
    }
    function handleFinish(){
        progressctx.hideCheckout();
        clearCart();
        clearData();
    }



    async function checkoutAction(prevState , fd){
    // event.preventDefault();
    // const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest( JSON.stringify({
            order: {
                items: items,
                customer: customerData
            }
        }));

    }

    const [formState , formAction , isSending ] = useActionState(checkoutAction , null);

    let actions =(<>
    <Button textonly type="button" onClick={handleClose}>
         Close
    </Button>

    <Button > Submit Order</Button>
    </>);

    if (isSending){
        actions = <span>Sending order data...</span>
    }

    if(data && !error){
        return <Modal open={progressctx.progress === 'checkout'} onClose={handleClose} className="cart modal">
            <h2>Success!</h2>
            <p>your order was subitted successfully.</p>
            <p>We will get back to you with more details via email within the next 
                few minutes.
            </p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>

        </Modal>
    }

    return (
        <Modal className="checkout modal" open={progressctx.progress === 'checkout'} onClose={handleClose} >
            <form action={formAction} >
                <h2>Checkout</h2>
                <p>
                    Total Amount: {currencyFormatter.format(cartTotal)}
                </p>

              <Input
                label="Full Name"
                type="text"
                id="name"
                />

                <Input
                label="Email Address"
                type="email"
                id="email"
                />
                 <Input
                label="Street"
                type="text"
                id="street"
                />
            <div className="control-row">

                <Input
                    label="Postal Code"
                    type="text"
                    id="postal-code"
                />

                <Input
                    label="City"
                    type="text"
                    id="city"
                />

            </div>
        {error && <Error title="Failed to submit order" message={error} />}
        
        <p className="modal-actions">
            {actions}
        </p>

            </form>


        </Modal>
    );
    }