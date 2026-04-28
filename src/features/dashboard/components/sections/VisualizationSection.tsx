import { VisualizationOverlay } from "./VisualizationOverlay"

interface VisualizationSectionProps {
    activeLink: { id: string; url: string; label: string } | null | undefined
}

export function VisualizationSection({ activeLink }: VisualizationSectionProps) {
    return (
        <section className="flex-1 min-h-[60vh] overflow-hidden rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Visualização
                    </h3>
                    {activeLink && (
                        <a
                            href={activeLink.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            {activeLink.url}
                        </a>
                    )}
                </div>
                <div />
            </div>

            <div className="h-full min-h-[40vh]">
                {activeLink ? (
                    <div className="relative h-full w-full">
                        <iframe
                            key={activeLink.id}
                            src={activeLink.url}
                            title={activeLink.label}
                            className="relative z-10 h-full w-full border-0"
                            loading="lazy"
                            allow="clipboard-write; encrypted-media"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        />
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <VisualizationOverlay />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Selecione um link na sidebar para visualizar.
                    </div>
                )}
            </div>
        </section>
    )
}
