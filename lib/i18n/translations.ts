import type { Locale } from "./locale";

/**
 * Plain (non-parameterized) UI chrome strings — nav, headings, buttons,
 * hints, empty/loading states. Domain data that also varies by language
 * (position codes/names, formation descriptions, algorithm warnings)
 * lives next to that domain instead (see `lib/domain/position.ts`,
 * `lib/domain/formation.ts`, `lib/lineup/matching.ts`), not here.
 */
const STRINGS = {
  es: {
    "nav.players": "Jugadores",
    "nav.formations": "Formaciones",
    "nav.matchday": "Fecha",

    "home.subtitle":
      "Llevá el control de las posiciones de tu plantel, marcá quién está confirmado para el próximo partido, y conseguí un once inicial recomendado a partir de los jugadores que realmente tenés disponibles — se acabó adivinar la alineación una hora antes.",
    "home.cardPlayers.title": "Gestionar Jugadores",
    "home.cardPlayers.description":
      "Agregá, editá y quitá jugadores, junto con sus posiciones principales y secundarias.",
    "home.cardFormations.title": "Formaciones",
    "home.cardFormations.description":
      "Marcá con estrella las formaciones que usa tu equipo, para que aparezcan primero al elegir una en Fecha.",
    "home.cardMatchday.title": "Armar una Fecha",
    "home.cardMatchday.description":
      "Elegí quién está confirmado y conseguí la formación y alineación que mejor le queden a este plantel.",

    "players.heading": "Jugadores",
    "players.addPlayer": "Agregar jugador",
    "players.loading": "Cargando...",
    "players.empty": "Todavía no hay jugadores. Agregá el primero para arrancar.",
    "players.noPositionSet": "Sin posición",
    "players.alsoLabel": " · también: ",
    "players.edit": "Editar",
    "players.remove": "Quitar",

    "form.nameLabel": "Nombre",
    "form.namePlaceholder": "ej. Diego Gómez",
    "form.primaryLegend": "Posiciones principales (dejar vacío si todavía no se sabe)",
    "form.primaryHint":
      "Tocá para agregar. Un jugador puede ser igual de bueno en más de una posición — el orden igual le da una leve ventaja a la primera, así que poné la más fuerte primero.",
    "form.secondaryLegend": "Posiciones secundarias (también puede cubrir)",
    "form.secondaryHint":
      "Tocá para agregar. El orden importa — el algoritmo trata a la primera como mejor opción que la última, así que ordenalas de más a menos fuerte.",
    "form.footLegend": "Pie hábil",
    "form.footHint":
      "Se usa para preferir el puesto más hacia ese lado entre posiciones intercambiables (ej. el central más zurdo entre tres).",
    "form.injuryLegend": "Estado físico",
    "form.injuryHint":
      "Un jugador lesionado igual puede confirmarse para un partido, pero la recomendación lo deja como última opción.",
    "form.notesLabel": "Notas (opcional)",
    "form.nameRequired": "El nombre es obligatorio.",
    "form.saveError": "Hubo un problema al guardar el jugador. Probá de nuevo.",
    "form.saving": "Guardando...",
    "form.saveChanges": "Guardar cambios",
    "form.cancel": "Cancelar",

    "formations.heading": "Formaciones",
    "formations.subtitle":
      "Marcá con estrella las formaciones que realmente usa tu equipo — van a aparecer primero (marcadas con ★) en el selector de formaciones de Fecha.",
    "formations.loading": "Cargando...",
    "formations.saveError": "No se pudo guardar — probá de nuevo.",

    "matchday.heading": "Fecha",
    "matchday.subtitle":
      "Confirmá quién está disponible para este partido, generá la alineación que mejor encaje, y después arrastrá jugadores entre los puestos y el banco para ajustarla.",
    "matchday.confirmedPlayers": "Jugadores confirmados",
    "matchday.loadingPlayers": "Cargando jugadores...",
    "matchday.noPlayersYet": "Todavía no hay jugadores cargados — agregá algunos primero en Jugadores.",
    "matchday.noPositionSet": "Sin posición",
    "matchday.noPositionInline": "sin posición",
    "matchday.generate": "Generar alineación recomendada",
    "matchday.generating": "Generando...",
    "matchday.explainWithAI": "Explicar con IA",
    "matchday.orBuildManually": "o armar a mano:",
    "matchday.chooseFormation": "Elegí una formación…",
    "matchday.forceTitle":
      "Completa esta formación exacta con la mejor asignación de los jugadores confirmados",
    "matchday.assigning": "Asignando...",
    "matchday.reset": "Reiniciar",
    "matchday.generateError": "No se pudo generar la alineación. Probá confirmar al menos un jugador.",
    "matchday.forceError": "No se pudo encajar a los confirmados en esta formación.",
    "matchday.staleExplanationNote":
      "La alineación o los datos de algún jugador (posición, pie, lesión) cambiaron desde que se generó esto — la explicación de arriba puede estar desactualizada.",
    "matchday.bench": "Banco",
    "matchday.benchEmpty": "Todos los confirmados están en la cancha.",

    "language.spanish": "Español",
    "language.english": "English",
  },
  en: {
    "nav.players": "Players",
    "nav.formations": "Formations",
    "nav.matchday": "Match Day",

    "home.subtitle":
      "Keep track of your squad's positions, mark who's confirmed for the next match, and get a recommended starting eleven built from the players you actually have available — no more guessing the lineup an hour before kickoff.",
    "home.cardPlayers.title": "Manage Players",
    "home.cardPlayers.description":
      "Add, edit, and remove players, along with their primary and secondary positions.",
    "home.cardFormations.title": "Formations",
    "home.cardFormations.description":
      "Star the formations your team actually uses, so they show up first when picking one in Match Day.",
    "home.cardMatchday.title": "Build a Match Day",
    "home.cardMatchday.description":
      "Select who's confirmed and get the best-fitting formation and lineup for this squad.",

    "players.heading": "Players",
    "players.addPlayer": "Add player",
    "players.loading": "Loading...",
    "players.empty": "No players yet. Add your first one to get started.",
    "players.noPositionSet": "No position set",
    "players.alsoLabel": " · also: ",
    "players.edit": "Edit",
    "players.remove": "Remove",

    "form.nameLabel": "Name",
    "form.namePlaceholder": "e.g. Diego Gómez",
    "form.primaryLegend": "Primary positions (leave empty if not set yet)",
    "form.primaryHint":
      "Tap to add. A player can be equally good in more than one position — order still gives the first one a slight edge, so list the strongest first.",
    "form.secondaryLegend": "Secondary positions (can also cover)",
    "form.secondaryHint":
      "Tap to add. Order matters — the matching algorithm treats the first one as a better fit than the last, so list them from strongest to weakest.",
    "form.footLegend": "Preferred foot",
    "form.footHint":
      "Used to prefer the more strongly-sided slot among interchangeable ones (e.g. a left-sided center back among three).",
    "form.injuryLegend": "Injury status",
    "form.injuryHint":
      "An injured player can still be confirmed for a match, but the recommendation treats them as a last resort.",
    "form.notesLabel": "Notes (optional)",
    "form.nameRequired": "Name is required.",
    "form.saveError": "Something went wrong saving this player. Please try again.",
    "form.saving": "Saving...",
    "form.saveChanges": "Save changes",
    "form.cancel": "Cancel",

    "formations.heading": "Formations",
    "formations.subtitle":
      "Star the formations your team actually uses — they'll show first (marked ★) in the Match Day formation picker.",
    "formations.loading": "Loading...",
    "formations.saveError": "Could not save that — try again.",

    "matchday.heading": "Match Day",
    "matchday.subtitle":
      "Confirm who's available for this match, generate the best-fitting lineup, then drag players between slots and the bench to fine-tune it.",
    "matchday.confirmedPlayers": "Confirmed players",
    "matchday.loadingPlayers": "Loading players...",
    "matchday.noPlayersYet": "No players registered yet — add some on the Players page first.",
    "matchday.noPositionSet": "No position set",
    "matchday.noPositionInline": "no position",
    "matchday.generate": "Generate recommended lineup",
    "matchday.generating": "Generating...",
    "matchday.explainWithAI": "Explain with AI",
    "matchday.orBuildManually": "or build manually:",
    "matchday.chooseFormation": "Choose a formation…",
    "matchday.forceTitle": "Fill this exact formation with the best assignment of confirmed players",
    "matchday.assigning": "Assigning...",
    "matchday.reset": "Reset",
    "matchday.generateError": "Could not generate a lineup. Try confirming at least one player.",
    "matchday.forceError": "Could not fit confirmed players into this formation.",
    "matchday.staleExplanationNote":
      "The lineup or a player's details (position, foot, injury) have changed since this was generated — the explanation above may be out of date.",
    "matchday.bench": "Bench",
    "matchday.benchEmpty": "Everyone confirmed is on the pitch.",

    "language.spanish": "Español",
    "language.english": "English",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof (typeof STRINGS)["en"];

export function translate(locale: Locale, key: TranslationKey): string {
  return STRINGS[locale][key];
}

// --- Parameterized strings (need a value interpolated in) ---

export function formatRemoveConfirm(locale: Locale, name: string): string {
  return locale === "es" ? `¿Quitar a ${name} del plantel?` : `Remove ${name} from the squad?`;
}

export function formatMoveUp(locale: Locale, code: string): string {
  return locale === "es" ? `Subir ${code}` : `Move ${code} up`;
}

export function formatMoveDown(locale: Locale, code: string): string {
  return locale === "es" ? `Bajar ${code}` : `Move ${code} down`;
}

export function formatRemoveCode(locale: Locale, code: string): string {
  return locale === "es" ? `Quitar ${code}` : `Remove ${code}`;
}

export function formatAtTheBack(locale: Locale, defenders: number): string {
  return locale === "es" ? `Línea de ${defenders}` : `${defenders} at the back`;
}

export function formatFavorite(locale: Locale, name: string, isFavorite: boolean): string {
  if (locale === "es") {
    return isFavorite ? `Quitar ${name} de favoritas` : `Marcar ${name} como favorita`;
  }
  return isFavorite ? `Unfavorite ${name}` : `Favorite ${name}`;
}

export function formatForce(locale: Locale, formationName: string): string {
  return locale === "es" ? `Forzar ${formationName}` : `Force ${formationName}`;
}
