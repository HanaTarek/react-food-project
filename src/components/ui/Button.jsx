export default function Button({ children , className , textonly , ...props }){

    let cssClass = textonly ? "text-button" : "button" ;

    if(className){
        cssClass = cssClass + " " + className;
    }

    return( <button className={cssClass} {...props}>{children}</button>);

}


