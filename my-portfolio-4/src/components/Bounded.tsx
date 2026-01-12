import React from "react";
import clsx from "clsx";

type BoundedProps<T extends React.ElementType = "section"> = {
    as?: T;
    className?: string;
    children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const Bounded = React.forwardRef<HTMLElement, BoundedProps>(
    ({ as = "section", className, children, ...restProps }, ref) => {
        const Component = as;
        return (
            <Component
                ref={ref}
                className={clsx("px-4 py-10 md:px-6 md:py-14 lg:py-16", className)}
                {...restProps}
            >
                <div className="mx-auto w-full max-w-7xl">{children}</div>
            </Component>
        );
    }
);

// Set a display name for the component
Bounded.displayName = "Bounded";

export default Bounded;
