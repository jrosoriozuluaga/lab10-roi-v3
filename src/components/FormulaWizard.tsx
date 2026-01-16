
import { Calculator, BookOpen, ScrollText, ArrowRight, Variable } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function FormulaWizard() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-primary border-dashed">
                    <BookOpen className="w-4 h-4" />
                    ¿Cómo se calcula esto?
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <Calculator className="w-6 h-6 text-primary" />
                        Companion: ROI Formula
                    </SheetTitle>
                    <SheetDescription>
                        Explicación detallada del modelo matemático detrás del calculadora.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="equation" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="equation">La Ecuación</TabsTrigger>
                        <TabsTrigger value="glossary">Glosario</TabsTrigger>
                        <TabsTrigger value="methodology">Metodología</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: THE EQUATION */}
                    <TabsContent value="equation" className="space-y-6">
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <h3 className="font-mono text-sm text-muted-foreground mb-2">Fórmula Maestra</h3>
                            <div className="text-lg font-bold font-mono">
                                Running Value = <span className="text-green-500">(Benefits)</span> - <span className="text-red-500">(Costs)</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-2 border-green-500 pl-4">
                                <h4 className="font-semibold text-green-500">1. Total Benefits</h4>
                                <p className="text-sm text-muted-foreground mb-2">Suma de tres pilares:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="font-mono bg-green-500/10 text-green-500 px-1 rounded">Hard Savings</span>
                                        <span>Ahorro de tiempo (FTE) ajustado por la <strong>Eficiencia (η)</strong>. No todo el tiempo ahorrado es productivo.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-mono bg-green-500/10 text-green-500 px-1 rounded">Net Revenue</span>
                                        <span>Nuevos ingresos atribuidos a la AI, ajustados por factor de <strong>Atribución (α)</strong>.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-mono bg-green-500/10 text-green-500 px-1 rounded">Cost Avoidance</span>
                                        <span>Riesgos mitigados (errores, multas, downtime).</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-red-500 pl-4">
                                <h4 className="font-semibold text-red-500">2. Total Costs</h4>
                                <p className="text-sm text-muted-foreground mb-2">Costos anualizados:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="font-mono bg-red-500/10 text-red-500 px-1 rounded">OpEx</span>
                                        <span>Licencias mensuales × 12.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-mono bg-red-500/10 text-red-500 px-1 rounded">CapEx</span>
                                        <span>Implementación + Training (One-time).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-mono bg-red-500/10 text-red-500 px-1 rounded">Hidden</span>
                                        <span>Curva de aprendizaje (pérdida de productividad inicial).</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: GLOSSARY */}
                    <TabsContent value="glossary">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="efficiency">
                                <AccordionTrigger className="font-mono text-amber-500">
                                    <div className="flex items-center gap-2">
                                        <Variable className="w-4 h-4" />
                                        Eficiencia (η)
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Representa qué porcentaje del tiempo ahorrado se convierte realmente en trabajo productivo.
                                    <br /><br />
                                    <em>Ejemplo:</em> Si ahorras 1 hora, no trabajas 1 hora más inmediatamente. Usamos un factor conservador (0.55) para descontar pausas, contexto y fricción.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="attribution">
                                <AccordionTrigger className="font-mono text-blue-500">
                                    <div className="flex items-center gap-2">
                                        <Variable className="w-4 h-4" />
                                        Atribución (α)
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Porcentaje de nuevos ingresos que podemos científicamente atribuir a la AI y no a otros factores (marketing, mercado, etc).
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="hidden-cost">
                                <AccordionTrigger className="font-mono text-red-400">
                                    <div className="flex items-center gap-2">
                                        <Variable className="w-4 h-4" />
                                        Curva de Aprendizaje
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Costo de oportunidad. Mientras el equipo aprende la herramienta, es más lento. Calculamos este costo como una "inversión negativa" inicial.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </TabsContent>

                    {/* TAB 3: METHODOLOGY */}
                    <TabsContent value="methodology" className="space-y-4">
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <ScrollText className="w-4 h-4" />
                                    Proceso de Medición
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    No solo medimos el final, medimos todo el ciclo de vida del valor.
                                </p>
                            </div>

                            <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                <div className="relative">
                                    <div className="absolute -left-[29px] bg-background border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                                    <h5 className="font-medium text-sm">Baseline (Benchmark)</h5>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Establecemos cuánto tiempo toma la tarea *sin* AI.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[29px] bg-background border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                                    <h5 className="font-medium text-sm">Ajuste de Realidad</h5>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Aplicamos los factores de seguridad (η y α) para no inflar los números.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[29px] bg-background border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                                    <h5 className="font-medium text-sm">Validación (Output)</h5>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Si el "Delivery Rate" no sube, asumimos que el ahorro de tiempo es falso y reducimos la Eficiencia automáticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h4 className="text-sm font-semibold text-primary mb-1">¿Dudas sobre los datos?</h4>
                    <p className="text-xs text-muted-foreground">
                        Revisa el documento completo de estrategia en <code className="bg-muted px-1 rounded">FRAMEWORK.md</code> en el repositorio.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
