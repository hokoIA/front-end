import { PermissionGate } from "@/components/auth/permission-gate";
import { EmptyState } from "@/components/feedback/empty-state";
import { CustomersHubView } from "@/features/customers";

export default function ClientesPage() {
  return (
    <PermissionGate
      permission="platforms:connect"
      fallback={
        <div className="hk-page hk-page--narrow py-7">
          <EmptyState
            title="Acesso indisponível"
            description="Peça a um administrador a permissão de conectar plataformas para acessar Clientes & Integrações."
          />
        </div>
      }
    >
      <CustomersHubView />
    </PermissionGate>
  );
}
