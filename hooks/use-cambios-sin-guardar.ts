"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function useUnsavedChangesWarning(shouldWarn: boolean) {
  const pathname = usePathname();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldWarn) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (shouldWarn && !confirm("Tienes cambios sin guardar. ¿Deseas salir de esta página?")) {
        throw new Error("Ruta cancelada por cambios no guardados");
      }
    };

    window.addEventListener("next:navigation-start", handleRouteChange);

    return () => {
      window.removeEventListener("next:navigation-start", handleRouteChange);
    };
  }, [shouldWarn, pathname]);
}
