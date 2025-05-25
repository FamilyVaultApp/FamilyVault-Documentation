# Dokumentacja FamilyVault

Oficjalna dokumentacja aplikacji **FamilyVault** – prywatnego komunikatora rodzinnego z szyfrowaniem end-to-end.

## O projekcie

FamilyVault to bezpieczna aplikacja mobilna przeznaczona dla rodzin, oferująca:
- 🔒 Szyfrowanie end-to-end (E2EE)
- 💬 Bezpieczne czaty grupowe i indywidualne
- 📋 Listy zadań dla organizacji życia rodzinnego
- 📁 Szuflada na dokumenty i zdjęcia
- 🏠 Możliwość własnego hostingu (PrivMX Bridge)

## Instalacja

Sklonuj repozytorium i zainstaluj zależności:

```bash
git clone https://github.com/FamilyVaultApp/FamilyVault-Documentation.git
cd FamilyVault-Documentation
npm install
```

## Rozwój lokalny

Uruchom serwer deweloperski:

```bash
npm start
```

Ta komenda uruchamia lokalny serwer deweloperski i otwiera przeglądarkę. Większość zmian zostanie odzwierciedlona na żywo bez konieczności restartowania serwera.

## Budowanie

Zbuduj statyczną wersję strony:

```bash
npm run build
```

Ta komenda generuje statyczną zawartość do katalogu `build`, którą można serwować za pomocą dowolnego serwisu hostingu statycznych plików.


## Skrypty

- `npm start` - uruchomienie serwera deweloperskiego
- `npm run build` - budowanie wersji produkcyjnej
- `npm run serve` - serwowanie zbudowanej wersji lokalnie
- `npm run clear` - czyszczenie cache'u Docusaurus
- `npm run typecheck` - sprawdzanie typów TypeScript

## Technologie

- [Docusaurus 3.7.0](https://docusaurus.io/) - generator statycznych stron
- React 19 - biblioteka interfejsu użytkownika
- TypeScript - typy dla JavaScript
- MDX - Markdown z komponentami React

## Linki

- 🌐 [Strona projektu](https://familyvault.pl/)
- 🐙 [Organizacja GitHub](https://github.com/FamilyVaultApp)

