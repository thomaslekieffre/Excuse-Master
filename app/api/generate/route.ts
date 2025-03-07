import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type RequestBody = {
  mode?: string;
  context?: string;
  isCombo?: boolean;
};

export async function POST(req: Request) {
  try {
    const { mode, context, isCombo } = (await req.json()) as RequestBody;

    let prompt = "";
    const comboIntro = isCombo
      ? "Génère 2 ou 3 excuses qui s'enchaînent de manière cohérente et complémentaire. Les excuses doivent former une histoire logique. "
      : "Génère une excuse ";

    switch (mode) {
      case "flemme":
        prompt = `${comboIntro}décalée et humoristique pour justifier un retard dans un projet de développement web. ${
          isCombo
            ? "Chaque excuse doit être décontractée et refléter un manque total de motivation. "
            : "L'excuse doit être spontanée, improbable et pleine d'esprit, reflétant une attitude désinvolte. "
        }${context ? `Contexte : ${context}. ` : ""}Réponds uniquement avec ${
          isCombo ? "les excuses" : "l'excuse"
        }, sans introduction ni commentaire.`;
        break;
      case "pro":
        prompt = `${comboIntro}professionnelle et crédible pour justifier un retard dans un projet de développement informatique. ${
          isCombo
            ? "Chaque excuse doit être technique et utiliser un vocabulaire professionnel différent (infrastructure, développement, sécurité, etc.). "
            : "L'excuse doit inclure des détails techniques plausibles et utiliser un vocabulaire adapté au monde du dev. "
        }${context ? `Contexte : ${context}. ` : ""}Réponds uniquement avec ${
          isCombo ? "les excuses" : "l'excuse"
        }, sans introduction ni commentaire.`;
        break;
      case "ultra":
        prompt = `${comboIntro}complètement absurde et surréaliste pour justifier un retard dans un projet de développement informatique. ${
          isCombo
            ? "Chaque excuse doit être de plus en plus délirante, créant une escalade dans l'absurde. "
            : "L'excuse doit être extravagante, mêlant des éléments fantastiques et technologiques improbables. "
        }${context ? `Contexte : ${context}. ` : ""}Réponds uniquement avec ${
          isCombo ? "les excuses" : "l'excuse"
        }, sans introduction ni commentaire.`;
        break;
      case "historique":
        prompt = `${comboIntro}${
          isCombo
            ? "basée sur différents événements historiques de l'informatique, en créant des parallèles humoristiques avec la situation actuelle. Chaque excuse doit référencer un événement différent. "
            : "basée sur un événement historique de l'informatique, en faisant un parallèle humoristique avec la situation actuelle. "
        }${context ? `Contexte : ${context}. ` : ""}Réponds uniquement avec ${
          isCombo ? "les excuses" : "l'excuse"
        }, sans introduction ni commentaire.`;
        break;
      case "startup":
        prompt = `${comboIntro}${
          isCombo
            ? "utilisant différents aspects du jargon startup (growth, scalabilité, disruption, etc.) de manière exagérée et humoristique. Chaque excuse doit utiliser un aspect différent de la culture startup. "
            : "utilisant le jargon typique des startups de manière exagérée et humoristique. "
        }${context ? `Contexte : ${context}. ` : ""}Réponds uniquement avec ${
          isCombo ? "les excuses" : "l'excuse"
        }, sans introduction ni commentaire.`;
        break;
      default:
        prompt = `Génère ${
          isCombo
            ? "2 ou 3 excuses créatives et complémentaires"
            : "une excuse créative"
        } pour justifier un retard dans ce contexte : ${context}. ${
          isCombo ? "Les excuses doivent former une histoire cohérente. " : ""
        }Réponds uniquement avec ${
          isCombo ? "les excuses" : "l'excuse"
        }, sans introduction ni commentaire.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const excuse = response.text();

    if (!excuse) {
      throw new Error("Réponse vide de l'IA");
    }

    return NextResponse.json({
      excuse: excuse.trim(),
    });
  } catch (error) {
    console.error("Erreur lors de la génération de l'excuse:", error);

    const fallbackExcuses = {
      flemme: [
        "Mon chat a vomi sur mon clavier",
        "J'ai fait une sieste de 5 minutes qui a duré 5 heures",
        "Mon café était trop bon, j'ai passé la journée à en boire",
      ],
      pro: [
        "Un bug critique en production a nécessité mon attention immédiate",
        "La mise à jour du framework a causé des conflits de dépendances",
        "Une faille de sécurité a été détectée dans notre infrastructure",
      ],
      ultra: [
        "J'ai été kidnappé par un dev COBOL qui voulait me convertir",
        "Un bug a créé une faille temporelle dans mon IDE",
        "Mon code s'est senti déprimé et est parti en thérapie",
      ],
      historique: [
        "Comme le bug de l'an 2000, mon code a eu une crise existentielle temporelle",
        "Tel le premier bug informatique trouvé dans le Mark II, un insecte a court-circuité mon processus de développement",
      ],
      startup: [
        "Notre MVP de gestion du temps a pivoté vers un paradigme de procrastination agile",
        "Le KPI de productivité a été disrupté par une synergie négative avec le café",
      ],
    };

    const reqBody = error as { mode?: string; isCombo?: boolean };
    const mode = reqBody.mode || "flemme";
    const excuses =
      fallbackExcuses[mode as keyof typeof fallbackExcuses] ||
      fallbackExcuses.flemme;

    let fallbackExcuse = excuses[Math.floor(Math.random() * excuses.length)];

    if (reqBody.isCombo) {
      const secondExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      fallbackExcuse = `${fallbackExcuse} Et pour couronner le tout, ${secondExcuse.toLowerCase()}`;
    }

    return NextResponse.json({
      excuse: fallbackExcuse,
    });
  }
}
