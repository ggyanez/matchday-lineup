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
    "nav.matchday": "Próxima Fecha",

    "home.subtitle":
      "Llevá el control de las posiciones de tu plantel, marcá quién está confirmado para el próximo partido, y conseguí un once inicial recomendado a partir de los jugadores que realmente tenés disponibles — se acabó adivinar la alineación una hora antes.",
    "home.cardPlayers.title": "Gestionar Jugadores",
    "home.cardPlayers.description":
      "Agregá, editá y quitá jugadores, junto con sus posiciones principales y secundarias.",
    "home.cardFormations.title": "Formaciones",
    "home.cardFormations.description":
      "Marcá con estrella las formaciones que usa tu equipo, para que aparezcan primero al elegir una en Fecha.",
    "home.cardMatchday.title": "Armar la Alineación",
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
    "players.sortBy": "Ordenar por:",
    "players.sortByName": "Nombre",
    "players.sortByPosition": "Posición",
    "players.filterBy": "Filtrar por:",
    "players.filterAll": "Todos",
    "players.filterRegularOnly": "Solo Fijos",
    "players.filterGuestOnly": "Solo Invitados",
    "players.filterHealthyOnly": "Solo Sanos",
    "players.filterInjuredOnly": "Solo Lesionados",
    "players.filterGoalkeepersOnly": "Solo Arqueros",
    "players.filterDefendersOnly": "Solo Defensores",
    "players.filterMidfieldersOnly": "Solo Mediocampistas",
    "players.filterForwardsOnly": "Solo Delanteros",
    "players.filterNoPositionOnly": "Sin posición",
    "players.filteredEmpty": "Ningún jugador cumple con estos filtros.",

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
    "form.membershipLegend": "Fijo o invitado",
    "form.membershipHint":
      "Un jugador fijo pesa muchísimo más que uno invitado a la hora de armar la alineación — un invitado solo ocupa un puesto cuando no hay un fijo que lo cubra igual de bien.",
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

    "matchday.heading": "Próxima Fecha",
    "matchday.subtitle":
      "Confirmá quién está disponible para este partido, generá la alineación que mejor encaje, y después arrastrá jugadores entre los puestos y el banco para ajustarla.",
    "matchday.confirmedPlayers": "Jugadores confirmados",
    "matchday.loadingPlayers": "Cargando jugadores...",
    "matchday.noPlayersYet": "Todavía no hay jugadores cargados — agregá algunos primero en Jugadores.",
    "matchday.noPositionSet": "Sin posición",
    "matchday.noPositionInline": "sin posición",
    "matchday.chooseFormation": "Elegí una formación…",
    "matchday.generateButton": "Generar Alineación",
    "matchday.generatingButton": "Generando...",
    "matchday.forceTitle":
      "Completa esta formación exacta con la mejor asignación de los jugadores confirmados",
    "matchday.or": "ó",
    "matchday.recommendButton": "Generar Alineación Automáticamente",
    "matchday.recommendingButton": "Generando automáticamente...",
    "matchday.reset": "Reiniciar",
    "matchday.generateError": "No se pudo generar la alineación. Probá confirmar al menos un jugador.",
    "matchday.forceError": "No se pudo encajar a los confirmados en esta formación.",
    "matchday.analyzeButton": "Analizar alineación con IA",
    "matchday.analyzingButton": "Analizando...",
    "matchday.analysisError": "No se pudo analizar la alineación. Probá de nuevo.",
    "matchday.staleExplanationNote":
      "La alineación o los datos de algún jugador (posición, pie, lesión) cambiaron desde que se pidió este análisis — puede estar desactualizado.",
    "matchday.bench": "Banco",
    "matchday.benchEmpty": "Todos los confirmados están en la cancha.",

    "language.spanish": "Español",
    "language.english": "English",

    "login.heading": "Iniciar sesión",
    "login.subtitle": "Ingresá con tu equipo para armar la alineación.",
    "login.teamLabel": "Equipo",
    "login.usernameLabel": "Usuario",
    "login.passwordLabel": "Contraseña",
    "login.submit": "Ingresar",
    "login.submitting": "Ingresando...",
    "login.error": "Equipo, usuario o contraseña incorrectos.",
    "login.genericError": "No se pudo iniciar sesión. Probá de nuevo.",

    "nav.team": "Equipo",
    "nav.logout": "Cerrar sesión",
    "nav.loggedInAs": "conectado como",

    "team.heading": "Equipo",
    "team.subtitle": "Los usuarios que ves acá tienen acceso a los mismos jugadores y formaciones que vos — no hay roles todavía, cualquiera puede gestionar todo.",
    "team.loading": "Cargando...",
    "team.membersHeading": "Usuarios",
    "team.addMember": "Agregar usuario",
    "team.addMemberUsernameLabel": "Usuario",
    "team.addMemberPasswordLabel": "Contraseña",
    "team.addMemberSubmit": "Agregar",
    "team.addMemberSubmitting": "Agregando...",
    "team.addMemberCancel": "Cancelar",
    "team.addMemberError": "No se pudo agregar el usuario.",
  },
  en: {
    "nav.players": "Players",
    "nav.formations": "Formations",
    "nav.matchday": "Next Matchday",

    "home.subtitle":
      "Keep track of your squad's positions, mark who's confirmed for the next match, and get a recommended starting eleven built from the players you actually have available — no more guessing the lineup an hour before kickoff.",
    "home.cardPlayers.title": "Manage Players",
    "home.cardPlayers.description":
      "Add, edit, and remove players, along with their primary and secondary positions.",
    "home.cardFormations.title": "Formations",
    "home.cardFormations.description":
      "Star the formations your team actually uses, so they show up first when picking one in Match Day.",
    "home.cardMatchday.title": "Build the Lineup",
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
    "players.sortBy": "Sort by:",
    "players.sortByName": "Name",
    "players.sortByPosition": "Position",
    "players.filterBy": "Filter by:",
    "players.filterAll": "All",
    "players.filterRegularOnly": "Regulars only",
    "players.filterGuestOnly": "Guests only",
    "players.filterHealthyOnly": "Healthy only",
    "players.filterInjuredOnly": "Injured only",
    "players.filterGoalkeepersOnly": "Goalkeepers only",
    "players.filterDefendersOnly": "Defenders only",
    "players.filterMidfieldersOnly": "Midfielders only",
    "players.filterForwardsOnly": "Forwards only",
    "players.filterNoPositionOnly": "No position only",
    "players.filteredEmpty": "No players match these filters.",

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
    "form.membershipLegend": "Regular or guest",
    "form.membershipHint":
      "A regular player weighs far more than a guest when building the lineup — a guest only takes a slot when there isn't a regular who covers it just as well.",
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

    "matchday.heading": "Next Matchday",
    "matchday.subtitle":
      "Confirm who's available for this match, generate the best-fitting lineup, then drag players between slots and the bench to fine-tune it.",
    "matchday.confirmedPlayers": "Confirmed players",
    "matchday.loadingPlayers": "Loading players...",
    "matchday.noPlayersYet": "No players registered yet — add some on the Players page first.",
    "matchday.noPositionSet": "No position set",
    "matchday.noPositionInline": "no position",
    "matchday.chooseFormation": "Choose a formation…",
    "matchday.generateButton": "Generate Lineup",
    "matchday.generatingButton": "Generating...",
    "matchday.forceTitle": "Fill this exact formation with the best assignment of confirmed players",
    "matchday.or": "or",
    "matchday.recommendButton": "Generate Lineup Automatically",
    "matchday.recommendingButton": "Generating automatically...",
    "matchday.reset": "Reset",
    "matchday.generateError": "Could not generate a lineup. Try confirming at least one player.",
    "matchday.forceError": "Could not fit confirmed players into this formation.",
    "matchday.analyzeButton": "Analyze Lineup with AI",
    "matchday.analyzingButton": "Analyzing...",
    "matchday.analysisError": "Could not analyze the lineup. Please try again.",
    "matchday.staleExplanationNote":
      "The lineup or a player's details (position, foot, injury) have changed since this analysis was requested — it may be out of date.",
    "matchday.bench": "Bench",
    "matchday.benchEmpty": "Everyone confirmed is on the pitch.",

    "language.spanish": "Español",
    "language.english": "English",

    "login.heading": "Sign in",
    "login.subtitle": "Sign in with your team to build the lineup.",
    "login.teamLabel": "Team",
    "login.usernameLabel": "Username",
    "login.passwordLabel": "Password",
    "login.submit": "Sign in",
    "login.submitting": "Signing in...",
    "login.error": "Wrong team, username, or password.",
    "login.genericError": "Could not sign in. Please try again.",

    "nav.team": "Team",
    "nav.logout": "Log out",
    "nav.loggedInAs": "signed in as",

    "team.heading": "Team",
    "team.subtitle": "Everyone you see here has the same access to your players and formations as you — there are no roles yet, anyone can manage everything.",
    "team.loading": "Loading...",
    "team.membersHeading": "Users",
    "team.addMember": "Add user",
    "team.addMemberUsernameLabel": "Username",
    "team.addMemberPasswordLabel": "Password",
    "team.addMemberSubmit": "Add",
    "team.addMemberSubmitting": "Adding...",
    "team.addMemberCancel": "Cancel",
    "team.addMemberError": "Could not add that user.",
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
