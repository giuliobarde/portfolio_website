import { KeyTextField, LinkField } from "@prismicio/client"
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import { MdArrowOutward } from "react-icons/md";


type ButtonProps = {
    linkField: LinkField;
    label: KeyTextField;
    showIcon?: boolean;
    className?: string;
}

export default function Button({ 
        linkField, 
        label, 
        showIcon=true, 
        className 
    }:ButtonProps) {
    return (
        <PrismicNextLink 
            field={linkField}
            className={clsx(
                "group relative flex w-fit text-slate-800 items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-50 px-4 py-3 md:py-2 font-bold transition-all ease-out hover:scale-105 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]",
                className)}
        >
            <span className="absolute inset-0 z-0 h-full translate-y-9 bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>
            <span className="relative flex items-center justify-center gap-2 code-style">
                <span className="code-bracket opacity-60">{"{"}</span>
                {label} {showIcon && <MdArrowOutward className="inline-block"/>}
                <span className="code-bracket opacity-60">{"}"}</span>
            </span>
        </PrismicNextLink>
    )
}