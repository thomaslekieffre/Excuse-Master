"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [excuse, setExcuse] = useState<string>("");
  const [customContext, setCustomContext] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCombo, setIsCombo] = useState(false);

  const handleGenerateExcuse = async (
    mode: "flemme" | "pro" | "ultra" | "random" | "historique" | "startup"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode:
            mode === "random"
              ? ["flemme", "pro", "ultra", "historique", "startup"][
                  Math.floor(Math.random() * 5)
                ]
              : mode,
          isCombo,
          context: customContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération de l'excuse");
      }

      const data = await response.json();
      setExcuse(data.excuse);
    } catch (error) {
      console.error("Erreur:", error);
      setExcuse(
        "Désolé, mon générateur d'excuses est lui-même en train de chercher une excuse..."
      );
    }
    setIsLoading(false);
  };

  const handleCustomExcuse = async () => {
    if (!customContext.trim()) return;
    handleGenerateExcuse("random");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔥 ExcuseMaster
          </h1>
          <p className="text-gray-300 text-xl">
            Le générateur d&apos;excuses ultime pour les développeurs
          </p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Switch
              id="combo-mode"
              checked={isCombo}
              onCheckedChange={setIsCombo}
              className={`scale-125 ${
                isCombo
                  ? "data-[state=checked]:bg-green-500"
                  : "data-[state=unchecked]:bg-red-500"
              }`}
            />
            <Label
              htmlFor="combo-mode"
              className={`text-lg transition-colors ${
                isCombo ? "text-green-400" : "text-red-400"
              }`}
            >
              Mode Combo {isCombo ? "✨ Activé" : "❌ Désactivé"}
            </Label>
          </div>
          <p
            className={`text-center mt-2 text-sm ${
              isCombo ? "text-green-400/70" : "text-red-400/70"
            }`}
          >
            {isCombo
              ? "Génère plusieurs excuses combinées pour un effet maximal !"
              : "Active ce mode pour obtenir des excuses plus élaborées"}
          </p>
        </Card>

        {excuse && (
          <Card className="p-6 bg-gray-800/50 border-gray-700 mb-8">
            <p className="text-xl text-white text-center italic">
              &ldquo;{excuse}&rdquo;
            </p>
          </Card>
        )}

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              {
                mode: "flemme" as const,
                icon: "😴",
                title: "Mode Flemme",
                description:
                  "Excuses décontractées et humoristiques pour les jours sans motivation",
              },
              {
                mode: "pro" as const,
                icon: "💼",
                title: "Mode Pro",
                description:
                  "Excuses techniques et crédibles avec du vocabulaire professionnel",
              },
              {
                mode: "ultra" as const,
                icon: "🌟",
                title: "Mode Ultra BS",
                description: "Excuses complètement délirantes et surréalistes",
              },
              {
                mode: "historique" as const,
                icon: "📚",
                title: "Mode Historique",
                description:
                  "Excuses basées sur des événements historiques de l'informatique",
              },
              {
                mode: "startup" as const,
                icon: "🚀",
                title: "Mode Startup",
                description: "Excuses avec le jargon typique des startups",
              },
              {
                mode: "random" as const,
                icon: "🎲",
                title: "Mode Aléatoire",
                description: "Mélange aléatoire de tous les styles d'excuses",
              },
            ].map((item) => (
              <Button
                key={item.mode}
                variant="outline"
                className="h-32 hover:bg-gray-700 flex flex-col gap-1 p-2"
                onClick={() => handleGenerateExcuse(item.mode)}
                disabled={isLoading}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.title}</span>
                <span className="text-xs text-gray-400 line-clamp-2">
                  {item.description}
                </span>
              </Button>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Mode Custom 🎯
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Décrivez votre situation spécifique pour obtenir une excuse
              adaptée
            </p>
            <textarea
              className="w-full h-24 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: Je dois livrer un site e-commerce..."
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
            />
            <Button
              className="w-full mt-4"
              onClick={handleCustomExcuse}
              disabled={isLoading || !customContext.trim()}
            >
              {isLoading ? "Génération en cours..." : "Générer une excuse"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
