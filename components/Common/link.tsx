"use client";
import {default as NextLink} from "next/link";
import { useRecoilValue } from "recoil";
import { relativePrefixState } from "../../states/states";

export default function Link({ children, href} : { children : React.ReactNode, href : string}) {
    const relativePrefix = useRecoilValue(relativePrefixState);

    return (
        <NextLink 
            href={relativePrefix + href}
        >
            {children}
        </NextLink>
    )
}