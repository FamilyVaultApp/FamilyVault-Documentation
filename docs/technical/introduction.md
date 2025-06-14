---
sidebar_position: 1
---

# Wprowadzenie do dokumentacji technicznej

## Przegląd aplikacji

FamilyVault to aplikacja mobilna napisana w **Kotlin Multiplatform**, która umożliwia bezpieczne przechowywanie i udostępnianie danych rodzinnych. Aplikacja została zaprojektowana z myślą o maksymalnym bezpieczeństwie i prywatności użytkowników.

## Architektura systemu

### Frontend - Aplikacja mobilna
- **Technologia**: Kotlin Multiplatform
- **Platformy docelowe**: Android i iOS
- **Status**: Część serwisów jest obecnie dostępna tylko na platformie Android

### Backend
- **Technologia**: C#

## Bezpieczeństwo

Aplikacja wykorzystuje bibliotekę **privMX** do implementacji szyfrowania end-to-end (E2E), zapewniając najwyższy poziom bezpieczeństwa przechowywanych danych. Wszystkie wrażliwe informacje są szyfrowane po stronie klienta przed wysłaniem na serwer.

