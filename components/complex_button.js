import Link from 'next/link';

const ComplexButton = (props) => {
    const anchor = (<a className={props.disabled ? "button complex disabled" : "button complex"} onClick={props.onClick ? props.onClick : null}>
        {props.children}
        <style global jsx>{`
            .button.complex {
                color: #ffffff;
                text-decoration: none;
                display: block;
                width: 170px;
                height: 85px;
                text-align: center;
                border-radius: 10px;
                border: 4px solid #9D9D9D;
                cursor: ${props.disabled ? "auto" : "pointer"};
            }
            .button.complex.disabled {
                border: 4px solid #4a4a4a;
                color: #4a4a4a;
            }
            .button.complex.disabled .dayRange .quadrant {
                border-color: #4a4a4a;
            }
            .button.complex:hover:not(.disabled) {
                background-color: #565656;
            }
        `}</style>
    </a>);

    return (props.href && !props.disabled) ? (<Link href={props.href}>{anchor}</Link>) : anchor;
};

export default ComplexButton;