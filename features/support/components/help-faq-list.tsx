"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUPPORT_FAQ } from "../constants/support-content";

export function HelpFaqList() {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-lg text-hk-deep">Perguntas frequentes</CardTitle>
        <CardDescription>
          Respostas essenciais sobre cobrança e conta. Artigos detalhados podem
          ser ligados aqui no futuro.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {SUPPORT_FAQ.map((item) => (
          <div
            key={item.q}
            className="border-b border-hk-border-subtle pb-4 last:border-0 last:pb-0"
          >
            <p className="font-medium text-hk-deep">{item.q}</p>
            <p className="mt-2 text-sm leading-relaxed text-hk-muted">
              {item.a}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
