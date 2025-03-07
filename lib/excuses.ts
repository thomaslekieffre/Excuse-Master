export type ExcuseMode = "flemme" | "pro" | "ultra" | "random";

export async function generateExcuse(mode: ExcuseMode): Promise<string> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode:
          mode === "random"
            ? ["flemme", "pro", "ultra"][Math.floor(Math.random() * 3)]
            : mode,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la génération de l'excuse");
    }

    const data = await response.json();
    return data.excuse;
  } catch (error) {
    console.error("Erreur:", error);
    return "Désolé, mon générateur d'excuses est lui-même en train de chercher une excuse...";
  }
}

export async function generateCustomExcuse(context: string): Promise<string> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la génération de l'excuse personnalisée");
    }

    const data = await response.json();
    return data.excuse;
  } catch (error) {
    console.error("Erreur:", error);
    return "Désolé, mon générateur d'excuses est lui-même en train de chercher une excuse...";
  }
}
