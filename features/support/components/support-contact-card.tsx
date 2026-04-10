"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUPPORT_CONTACT } from "../constants/support-content";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export function SupportContactCard() {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-lg text-hk-deep">Contato principal</CardTitle>
        <CardDescription>{SUPPORT_CONTACT.preferredChannel}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex gap-3">
          <Mail className="mt-0.5 size-4 shrink-0 text-hk-action" />
          <div>
            <p className="font-medium text-hk-deep">E-mail de suporte</p>
            <a
              href={`mailto:${SUPPORT_CONTACT.email}`}
              className="text-hk-action hover:underline"
            >
              {SUPPORT_CONTACT.email}
            </a>
          </div>
        </div>
        <div className="flex gap-3">
          <Phone className="mt-0.5 size-4 shrink-0 text-hk-action" />
          <div>
            <p className="font-medium text-hk-deep">Telefone</p>
            <p className="text-hk-ink">{SUPPORT_CONTACT.phone}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MessageCircle className="mt-0.5 size-4 shrink-0 text-hk-action" />
          <div>
            <p className="font-medium text-hk-deep">WhatsApp comercial</p>
            <p className="text-hk-ink">{SUPPORT_CONTACT.commercialWhatsapp}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-hk-action" />
          <div>
            <p className="font-medium text-hk-deep">Endereço</p>
            <p className="text-hk-ink">{SUPPORT_CONTACT.address}</p>
          </div>
        </div>
        <p className="rounded-lg border border-hk-border-subtle bg-hk-canvas/60 px-3 py-2 text-xs text-hk-muted">
          <span className="font-medium text-hk-deep">Horário: </span>
          {SUPPORT_CONTACT.hours}
        </p>
        <Button asChild className="w-full sm:w-auto">
          <a href={`mailto:${SUPPORT_CONTACT.email}?subject=Suporte%20ho.ko%20AI.nalytics`}>
            Escrever para o suporte
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
