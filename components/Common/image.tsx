"use client";
import { default as NextImage } from "next/image";
import { useRecoilValue } from "recoil";
import { prefixState } from "../../states/states";

export default function Image({src, width, height, alt} : {src : string, width : number, height : number, alt : string}) {
    const prefix = useRecoilValue(prefixState);

    return (
        <NextImage 
            src={prefix + src} 
            width={width}
            height={height}
            alt={alt ? alt : "null"}
        />
    )
}