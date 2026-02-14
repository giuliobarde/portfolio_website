import React from "react";
import { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

const TechStackBadges: React.FC<{ field: RichTextField }> = ({ field }) => {
    // Extract text content from rich text field
    const extractText = (richTextField: RichTextField): string[] => {
        if (!richTextField) return [];

        const items: string[] = [];

        richTextField.forEach((block: unknown) => {
            if (typeof block !== 'object' || block === null) return;

            const blockObj = block as Record<string, unknown>;

            if (blockObj.type === 'paragraph' || blockObj.type === 'heading1' || blockObj.type === 'heading2' || blockObj.type === 'heading3') {
                const content = blockObj.content;
                if (Array.isArray(content)) {
                    content.forEach((span: unknown) => {
                        if (typeof span === 'object' && span !== null) {
                            const spanObj = span as Record<string, unknown>;
                            if (typeof spanObj.text === 'string' && spanObj.text.trim()) {
                                items.push(spanObj.text.trim());
                            }
                        }
                    });
                }
            } else if (blockObj.type === 'list-item' || blockObj.type === 'o-list-item') {
                const content = blockObj.content;
                if (Array.isArray(content)) {
                    content.forEach((span: unknown) => {
                        if (typeof span === 'object' && span !== null) {
                            const spanObj = span as Record<string, unknown>;
                            if (typeof spanObj.text === 'string' && spanObj.text.trim()) {
                                items.push(spanObj.text.trim());
                            }
                        }
                    });
                }
            } else if (blockObj.type === 'preformatted') {
                // Handle preformatted text (often used for comma-separated lists)
                const text = typeof blockObj.text === 'string' ? blockObj.text : '';
                if (text.includes(',')) {
                    text.split(',').forEach((item: string) => {
                        const trimmed = item.trim();
                        if (trimmed) items.push(trimmed);
                    });
                } else if (text.trim()) {
                    items.push(text.trim());
                }
            }
        });

        return items.length > 0 ? items : [];
    };

    const techItems = extractText(field);

    if (techItems.length > 0) {
        return (
            <div className="flex flex-wrap gap-2">
                {techItems.map((item, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-200"
                    >
                        {item}
                    </span>
                ))}
            </div>
        );
    }

    // Fallback to rich text rendering if extraction didn't work
    return (
        <div className="text-slate-300">
            <PrismicRichText
                field={field}
                components={{
                    paragraph: ({ children }) => {
                        const childrenStr = String(children || '');
                        if (childrenStr.includes(',')) {
                            return (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {childrenStr.split(',').map((item: string, i: number) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-200"
                                        >
                                            {item.trim()}
                                        </span>
                                    ))}
                                </div>
                            );
                        }
                        return <div className="mb-2">{children}</div>;
                    },
                    list: ({ children }) => (
                        <div className="flex flex-wrap gap-2">
                            {children}
                        </div>
                    ),
                    listItem: ({ children }) => (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/60 border border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-200">
                            {children}
                        </span>
                    ),
                }}
            />
        </div>
    );
};

export default TechStackBadges;
