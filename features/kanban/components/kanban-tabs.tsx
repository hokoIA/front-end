"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type KanbanHubTab = "board" | "clients" | "labels";

export function KanbanTabs({
  value,
  onValueChange,
  board,
  clients,
  labels,
}: {
  value: KanbanHubTab;
  onValueChange: (v: KanbanHubTab) => void;
  board: React.ReactNode;
  clients: React.ReactNode;
  labels: React.ReactNode;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as KanbanHubTab)}
      className="w-full"
    >
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-auto">
        <TabsTrigger value="board" className="px-4">
          Kanban
        </TabsTrigger>
        <TabsTrigger value="clients" className="px-4">
          Clientes
        </TabsTrigger>
        <TabsTrigger value="labels" className="px-4">
          Etiquetas
        </TabsTrigger>
      </TabsList>
      <TabsContent value="board" className="mt-6">
        {board}
      </TabsContent>
      <TabsContent value="clients" className="mt-6">
        {clients}
      </TabsContent>
      <TabsContent value="labels" className="mt-6">
        {labels}
      </TabsContent>
    </Tabs>
  );
}
