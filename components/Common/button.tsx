"use client";

import { useState } from "react"

type ButtonProps = {
    className : string,
    onClick : Function,
    value : string,
    color : string,
}

type ButtonStyleType = {
    [key : string] : {
        bgColor : string,
        color : string,

    }
}

const ButtonStyle: ButtonStyleType = {
    'primary' : {
        bgColor : '',
        color : '',
    },
    'primaryOutline' : {
        bgColor : '',
        color : '',
    },
    'success' : {
        bgColor : '',
        color : '',
    },
    'successOutline' : {
        bgColor : '',
        color : '',
    },
    'warning': {
        bgColor : '',
        color : '',
    },
    'warningOutline' : {
        bgColor : '',
        color : '',
    }
}

export default function Button({className, onClick, value, color} : ButtonProps) {
    const [style, setStyle] = useState(ButtonStyle[color])

    return (
        <button
            className={`
                m-1 px-1
                rounded rounded-sm
            ${className}`}
            onClick={() => onClick}

            style={{
                outlineColor: '#111111',
                outline : 'solid',
                outlineWidth : 1
            }}
        >
            {value}
        </button>
    )
} 