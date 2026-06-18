import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({
    open ,
    children ,
    onClose,
    className = ''
}){
    const dialog = useRef();

    useEffect(()=>{
        const model = dialog.current ; 
        if (open){
            model.showModal();
        }

        return () => {model.close();}
    },[open]);

        return createPortal(<dialog
        ref={dialog} className={className}  onClose={onClose} >
            {children}
        </dialog>,
    document.getElementById('modal')    
    );


}