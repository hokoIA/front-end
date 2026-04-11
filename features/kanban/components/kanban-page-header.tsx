"use client";

export function KanbanPageHeader() {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-hk-deep md:text-3xl">
        Kanban
      </h1>
      <p className="max-w-3xl text-sm leading-relaxed text-hk-muted md:text-base">
        Central operacional da agência: organize o fluxo de trabalho, vincule
        clientes e etiquetas, e mantenha contexto e execução no mesmo ambiente
        — sem depender de ferramentas externas dispersas.
      </p>
    </header>
  );
}
