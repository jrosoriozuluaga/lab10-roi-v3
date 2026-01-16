
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ScenarioGuideModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ScenarioGuideModal({
    open,
    onOpenChange,
}: ScenarioGuideModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>📚</span> Guía de Escenarios
                    </DialogTitle>
                    <DialogDescription>
                        Entiende cómo funcionan los presets y cuándo utilizar cada escenario para tu proyección de ROI.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-full max-h-[calc(85vh-100px)] p-6 pt-2">
                    <div className="space-y-8 pb-4">

                        {/* Summary Table Section */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Resumen de Presets</h3>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="p-3 font-medium">Variable</th>
                                            <th className="p-3 font-medium text-center">🌧️ Pesimista</th>
                                            <th className="p-3 font-medium text-center">🌤️ Realista</th>
                                            <th className="p-3 font-medium text-center">🚀 Optimista</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr className="bg-background/50">
                                            <td className="p-3 font-medium">Factor de Eficiencia (η)</td>
                                            <td className="p-3 text-center text-muted-foreground">30%</td>
                                            <td className="p-3 text-center font-semibold text-[#FDE047]">55%</td>
                                            <td className="p-3 text-center text-muted-foreground">80%</td>
                                        </tr>
                                        <tr className="bg-background/50">
                                            <td className="p-3 font-medium">Horas Ahorradas/Semana</td>
                                            <td className="p-3 text-center text-muted-foreground">1 hr</td>
                                            <td className="p-3 text-center font-semibold text-[#FDE047]">2.5 hrs</td>
                                            <td className="p-3 text-center text-muted-foreground">5 hrs</td>
                                        </tr>
                                        <tr className="bg-background/50">
                                            <td className="p-3 font-medium">Factor de Atribución (α)</td>
                                            <td className="p-3 text-center text-muted-foreground">10%</td>
                                            <td className="p-3 text-center font-semibold text-[#FDE047]">30%</td>
                                            <td className="p-3 text-center text-muted-foreground">50%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <Separator />

                        {/* Detailed Scenarios Section */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-semibold text-foreground">Detalle de Escenarios</h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                                    <div className="text-2xl mb-1">🌧️</div>
                                    <h4 className="font-semibold text-foreground">Pesimista</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Conservador</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Asume baja adopción, alta resistencia al cambio y fricción en la implementación.
                                        Úsalo para presentar "el peor caso" a stakeholders financieros y demostrar seguridad en la inversión.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-card border border-[#FDE047]/20 shadow-sm space-y-2 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-1 bg-[#FDE047]/10 rounded-bl-lg">
                                        <span className="text-[10px] uppercase font-bold text-[#FDE047] px-2">Recomendado</span>
                                    </div>
                                    <div className="text-2xl mb-1">🌤️</div>
                                    <h4 className="font-semibold text-foreground">Realista</h4>
                                    <p className="text-xs text-[#FDE047] uppercase tracking-wider font-semibold">Base Case</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Basado en benchmarks actuales del mercado y proyecciones estándar.
                                        Es el punto de partida ideal para la planificación operativa y establecimiento de KPIs.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                                    <div className="text-2xl mb-1">🚀</div>
                                    <h4 className="font-semibold text-foreground">Optimista</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Best Case</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Asume implementación perfecta, adopción total y madurez operativa.
                                        Úsalo para inspirar y mostrar el potencial máximo tras una ejecución impecable.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* Interaction Logic Section */}
                        <section className="bg-muted/30 p-4 rounded-lg border border-border">
                            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                                <span>⚡</span> Interacción y Lógica
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                <li>
                                    <strong className="text-foreground">Selección Rápida:</strong> Al elegir un preset, las variables de Eficiencia, Horas y Atribución se actualizan instantáneamente.
                                </li>
                                <li>
                                    <strong className="text-foreground">Modo Personalizado:</strong> Si editas manualmente cualquiera de estos valores, el sistema cambiará a modo "Personalizado" automáticamente.
                                </li>
                                <li>
                                    <strong className="text-foreground">Comparación:</strong> Usa el botón "Comparar Escenarios" para ver los tres resultados lado a lado sin perder tu configuración actual.
                                </li>
                            </ul>
                        </section>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
