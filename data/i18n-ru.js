/* ============================================================
   Russian UI translations — PILOT (home page + nav + footer)
   ------------------------------------------------------------
   Keyed by the exact English UI string. Built from the community
   translation sheet filled by Dark Lord (raamon651@gmail.com), 2026-07-16:
   https://docs.google.com/spreadsheets/d/1TddKaUO1pjfEvyr4YxDyiP5ecF_VxL0Px47mj-RbCeA

   NOT auto-generated — regenerate/extend by reading col B of that sheet.
   Brand names (Neverwinter Compendium, YouTube, The N00bin Network) are
   intentionally absent → they render in English.

   Item NAMES are never in here — those stay English via translate="no".
   ============================================================ */
var I18N_RU = {
  "Everything you need to gear up in Neverwinter — mounts, companions, artifacts, and more, all in one friendly place.":
    "Всё, что Вам нужно, чтобы экипироваться в Neverwinter — скакуны, спутники, артефакты и многое другое — всё в одном удобном месте.",
  "Home": "Главная",
  "News": "Новости",
  "is live": "уже здесь",
  "Gear, comps, and screenshots from the upcoming module":
    "Экипировка, спутники и скриншоты из грядущего модуля",
  "View Preview": "Предпросмотр",
  "Mounts": "Скакуны",
  "Companions": "Спутники",
  "Artifacts": "Артефакты",
  "Consumables": "Расходники",
  "Mekaniks": "Механики",
  "Campaign Boosters": "Ускорители завершения кампаний",
  "Professions": "Мастерская",
  "NW Patch Notes": "Патчноуты",
  "Reports": "Обратная связь",
  "Mod 33 Preview": "Анонс Модуля 33",
  "Join N00bin Network": "Присоединиться к сети N00bin",
  "Stats, caps & formulas": "Характеристики, их максимальные значения и формулы",
  "Currency boost items & companions": "Предметы и спутники, увеличивающие получаемую валюту",
  "Artisans, tips & masterwork": "Ремесленники, комиссионные и мастеркрафт",
  "Auto-updated daily from Arc Games": "Ежедневное автообновление от Arc Games",
  "Bugs, missing items & suggestions": "Баги, недостающие элементы и предложения",
  "Gear, comps & preview screenshots": "Экипировка, спутники и кадры из обновления",
  "Watch N00bin on YouTube": "Посмотреть N00bin на YouTube",
  "Become a member of the community": "Станьте членом сообщества",
  "No news just yet — check back soon!": "Пока новостей нет — загляните позже!",
  "Feature": "Новинки",
  "Fix": "Исправления",
  "Data": "Данные",
  "Creators & Tools": "Креаторы и Инструменты",
  "Join on YouTube": "Присоединяйтесь на YouTube",
  "Want to collaborate or contribute data? Reach out:":
    "Хотите сотрудничать или поделиться данными? Свяжитесь со мной:",
  "Browse the full item database": "Просмотреть полную базу данных предметов",
  "every companion, mount, gear piece, artifact & more":
    "все спутники, скакуны, элементы экипировки, артефакты и многое другое"
};

/* Count nouns need Russian plural agreement (one / few / many, chosen by the
   last digit — Dark Lord's rule). He supplied the MANY form (numbers ending
   5-9, 0, and teens). The one/few forms are PENDING from him; until they
   arrive all three hold the many form, which is correct for every current
   count on the site (339 / 268 / 99 / 140 / 38). See js/i18n.js pluralRu(). */
var I18N_RU_COUNTS = {
  "mounts":     { one: "скакунов",  few: "скакунов",  many: "скакунов"  },
  "companions": { one: "спутников", few: "спутников", many: "спутников" },
  "buffs":      { one: "баффов",    few: "баффов",    many: "баффов"    },
  "artifacts":  { one: "артефактов",few: "артефактов",many: "артефактов"},
  "sets":       { one: "сетов",     few: "сетов",     many: "сетов"     }
};
