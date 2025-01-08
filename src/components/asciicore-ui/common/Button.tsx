import styled from "@emotion/styled"
import clsx from "clsx";
import React from 'react'

const Container = styled.button`
margin: 0;
padding: 0;
background-color: transparent;
color: var(--asciicore-ui-primary);
text-transform: uppercase;
border: none;
cursor: pointer;
font-family: var(--asciicore-ui-font);
font-size: var(--asciicore-ui-font-size);
transition: all .1s;
display: inline-block;
vertical-align: middle;
-webkit-transform: perspective(1px) translateZ(0);
transform: perspective(1px) translateZ(0);
box-shadow: 0 0 1px rgba(0, 0, 0, 0);
position: relative;
-webkit-transition-property: color;
transition-property: color;
-webkit-transition-duration: 0.3s;
transition-duration: 0.3s;

&::before,
&::after {
    content: "";
    font-family: inherit;
    font-size: inherit;
    color: inherit;
}

&::before {
    content: "[";
    margin-right: 1rem; /* Add space between [ and the button text */
}

&::after {
    content: "]";
    margin-left: 1rem; /* Add space between ] and the button text */
}

&:hover,
&.active {
    color: var(--asciicore-ui-background);
    background: var(--asciicore-ui-primary);
}

&.success > span {
    color: green;
}

&.error > span {
    color: red;
}
`

interface Props {
    active?: boolean,
    error?: boolean,
    success?: boolean
}
const Button = (props, { active = false, error = false, success = false }:Props) => {
    return (<Container {...props} className={clsx({ active: active, error: error, success: success })}>
        <span>{props.children}</span>
    </Container>)
}

export default Button;