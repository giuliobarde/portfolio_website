import React, { useEffect, useState } from "react";
import { Content, asLink, isFilled, RichTextField, LinkField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import Image from "next/image";

type ProjectModalProps = {
    project: Content.ProjectsSliceDefaultPrimaryProjectsItem;
    onClose: () => void;
};

// Component to extract and display tech stack as badges
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
        
        // If we got items, return them; otherwise fallback to rendering as rich text
        return items.length > 0 ? items : [];
    };
    
    const techItems = extractText(field);
    
    // If we extracted items, show as badges; otherwise render as rich text
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

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const [iframeError, setIframeError] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);
    
    // Get the website link URL (prefer web page links over GitHub)
    const getWebsiteUrl = (): string | null => {
        if (!Array.isArray(project.project_link) || project.project_link.length === 0) {
            return null;
        }
        
        // Helper function to extract URL from a link field
        const extractUrl = (link: LinkField): string | null => {
            if (!isFilled.link(link)) {
                return null;
            }
            
            const resolvedLink = asLink(link);
            if (typeof resolvedLink === 'string') {
                return resolvedLink;
            }
            
            // Handle LinkField object
            if (resolvedLink && typeof resolvedLink === 'object' && 'url' in resolvedLink) {
                return (resolvedLink as { url?: string }).url || null;
            }
            
            return null;
        };
        
        // Filter out GitHub links and find the first web page link
        const webPageLink = project.project_link.find(link => {
            const url = extractUrl(link);
            if (!url) return false;
            // Exclude GitHub links
            return !url.toLowerCase().includes('github.com');
        });
        
        // If found a web page link, return it
        if (webPageLink) {
            return extractUrl(webPageLink);
        }
        
        // If no web page link found, return null (don't use GitHub for preview)
        return null;
    };
    
    const websiteUrl = getWebsiteUrl();
    
    // Helper function to get descriptive label for a link
    const getLinkLabel = (link: LinkField): string => {
        const extractUrl = (linkField: LinkField): string | null => {
            if (!isFilled.link(linkField)) {
                return null;
            }
            
            const resolvedLink = asLink(linkField);
            if (typeof resolvedLink === 'string') {
                return resolvedLink;
            }
            
            if (resolvedLink && typeof resolvedLink === 'object' && 'url' in resolvedLink) {
                return (resolvedLink as { url?: string }).url || null;
            }
            
            return null;
        };
        
        const url = extractUrl(link);
        if (!url) return 'Visit Link';
        
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes('github.com')) {
            return 'View on GitHub';
        } else if (urlLower.includes('gitlab.com')) {
            return 'View on GitLab';
        } else if (urlLower.includes('bitbucket.org')) {
            return 'View on Bitbucket';
        } else if (urlLower.includes('netlify.com') || urlLower.includes('netlify.app')) {
            return 'View on Netlify';
        } else if (urlLower.includes('codepen.io')) {
            return 'View on CodePen';
        } else if (urlLower.includes('codesandbox.io')) {
            return 'View on CodeSandbox';
        } else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
            return 'Watch on YouTube';
        } else if (urlLower.includes('vimeo.com')) {
            return 'Watch on Vimeo';
        } else if (urlLower.includes('dribbble.com')) {
            return 'View on Dribbble';
        } else if (urlLower.includes('behance.net')) {
            return 'View on Behance';
        } else if (urlLower.includes('figma.com')) {
            return 'View on Figma';
        } else if (urlLower.includes('linkedin.com')) {
            return 'View on LinkedIn';
        } else if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
            return 'View on Twitter';
        } else {
            return 'Visit Website';
        }
    };
    
    // Reset iframe state when website URL changes
    useEffect(() => {
        setIframeError(false);
        setIframeLoading(true);
    }, [websiteUrl]);
    
    // Prevent scrolling when the modal is open
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
        document.body.classList.remove("overflow-hidden");
        };
    }, []);

    // Close modal when clicking outside or pressing Escape
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).id === "modal-overlay") {
            onClose();
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <div 
            id="modal-overlay"
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
            onClick={handleOutsideClick}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
            <div 
                className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl max-w-[90vw] sm:max-w-3xl w-full relative max-h-[90vh] overflow-hidden border border-slate-600/50"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'zoomIn 0.3s ease-out' }}
            >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none" />
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-slate-800/80 backdrop-blur-sm text-slate-300 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700 border border-slate-600/50 hover:border-yellow-400/50 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-800 group"
                    aria-label="Close modal"
                >
                    <svg 
                        className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                    <div className="p-6 md:p-8">
                        {/* Header Section with Image */}
                        {project.project_image?.url && (
                            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/90 via-slate-800/50 to-transparent z-10" />
                                <Image
                                    src={project.project_image.url}
                                    alt={project.project_image.alt ?? "Project Image"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 768px"
                                />
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20" />
                            </div>
                        )}

                        {/* Project Name */}
                        {project.project_name && (
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                                {project.project_name}
                            </h2>
                        )}

                        {/* Divider */}
                        <div className="w-20 h-1 bg-gradient-to-r from-yellow-400/50 via-yellow-400 to-yellow-400/50 rounded-full mb-6" />

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column: Description */}
                            <div className="space-y-6">
                                {/* Project Description */}
                                {project.project_expanded_description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">About</h3>
                                        <div className="text-slate-300 prose prose-invert prose-sm max-w-none">
                                            <PrismicRichText field={project.project_expanded_description} />
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {Array.isArray(project.project_link) && project.project_link.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Links</h3>
                                        <div className="flex flex-col gap-3">
                                            {project.project_link.map((link, index) => (
                                                <PrismicNextLink
                                                    key={index}
                                                    field={link} 
                                                    className="group inline-flex items-center gap-2 text-slate-300 hover:text-yellow-400 transition-colors duration-300 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-yellow-400/50 w-fit"
                                                >
                                                    <span>{getLinkLabel(link)}</span>
                                                    <svg 
                                                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </PrismicNextLink>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Live Preview & Tech Stack */}
                            <div className="space-y-6">
                                {/* Live Website Preview or Static Image - Only show if there's a website URL or project image */}
                                {(websiteUrl || project.project_image?.url) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                                            {websiteUrl ? "Live Preview" : "Preview"}
                                        </h3>
                                        
                                        {websiteUrl && !iframeError ? (
                                            <div className="relative w-full rounded-xl overflow-hidden border border-slate-600/50 bg-slate-900 shadow-2xl" style={{ aspectRatio: '16/9' }}>
                                                {iframeLoading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                                            <span className="text-sm text-slate-400">Loading desktop preview...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Container for scaled and centered iframe */}
                                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                                    <div
                                                        style={{
                                                            transform: 'scale(0.25)',
                                                            transformOrigin: 'center center',
                                                            width: '1366px',
                                                            height: '768px'
                                                        }}
                                                    >
                                                        <iframe
                                                            src={websiteUrl || ''}
                                                            className="border-0"
                                                            title={`Desktop preview of ${project.project_name || 'project'}`}
                                                            onLoad={() => setIframeLoading(false)}
                                                            onError={() => {
                                                                setIframeError(true);
                                                                setIframeLoading(false);
                                                            }}
                                                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                                            loading="lazy"
                                                            style={{
                                                                width: '1366px',
                                                                height: '768px',
                                                                border: 'none'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* Fallback: Show project image only if no website URL or iframe error */}
                                        {project.project_image?.url && (!websiteUrl || iframeError) && (
                                            <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                                                <Image
                                                    src={project.project_image.url}
                                                    alt={project.project_image.alt ?? "Project Image"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 90vw, 384px"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        )}
                                        
                                        {iframeError && websiteUrl && (
                                            <div className="mt-2 p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                                                <p className="text-xs text-yellow-400/80">
                                                    ⚠️ This website blocks iframe embedding. Click the link below to view it directly.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tech Stack */}
                                {project.tech_stack && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Tech Stack</h3>
                                        <TechStackBadges field={project.tech_stack} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;