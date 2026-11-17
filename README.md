# Kvízy z učebnice – frontend v2

React aplikace pro telefon i počítač. Žák se přihlásí, vyplní kvíz a vidí vlastní
výsledky. Administrátor může z fotografie nebo galerie vytvořit návrh přes AI,
zkontrolovat otázky, citace a správné odpovědi, pak kvíz zveřejnit. Může také
spravovat účty a mazat kvízy.

U nového kvízu lze otevřít rychlé focení s volbami Opakovat, OK a OK +
(vložit a pokračovat ve focení), použít systémový fotoaparát nebo galerii.
Výchozí cílová skupina se ukládá u administrátorského účtu a načte se na
dalším zařízení. Návrh zůstává v `sessionStorage` otevřené karty.

## Sestavení

```cmd
npm ci
npm run build
```

Netlify: build command `npm run build`, publish directory `build`. Soubor
`public/_redirects` zajišťuje, že fungují přímé odkazy na podstránky.
`REACT_APP_API_BASE` lze nastavit na URL backendu; výchozí je stávající Render API.

Token přihlášení zůstává pouze v `sessionStorage` dané karty. Po zavření karty
se uživatel přihlásí znovu. API klíč OpenAI patří výhradně do Renderu.
