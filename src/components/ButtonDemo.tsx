import { Button } from "@/components/ui/button";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-4 p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm">
      <Button variant="default">
        Confirmar Lançamento
      </Button>
      
      <Button variant="outline">
        Exportar PDF
        <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground">
          NEW
        </span>
      </Button>

      <Button variant="secondary">
        Cancelar
      </Button>

      <Button variant="ghost">
        Ajuda
      </Button>
    </div>
  );
}
