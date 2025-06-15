---
sidebar_position: 7
---

# JoinStatusService


`JoinStatusService` jest serwisem odpowiedzialnym za zarządzanie statusem dołączania do grup rodzinnych w aplikacji FamilyVault. Obsługuje proces generowania tokenów dołączania, monitorowania statusu oraz aktualizowania stanu procesu dołączania nowych członków do grup rodzinnych.

## Zależności

Serwis korzysta z następujących komponentów:
- `FamilyVaultBackendClient` - komunikacja z backendem FamilyVault

## Metody publiczne

### Generowanie statusu dołączania

#### `generateJoinStatus`
```kotlin
suspend fun generateJoinStatus(): JoinStatus
```

**Opis:** Generuje nowy token dołączania wraz z początkowym statusem.

**Zwraca:** Obiekt `JoinStatus` z wygenerowanym tokenem

**Zastosowanie:** Wywoływane przez opiekuna grupy rodzinnej, który chce wygenerować kod dołączania dla nowego członka

### Pobieranie statusu

#### `getJoinStatus`
```kotlin
suspend fun getJoinStatus(token: String): JoinStatus
```

**Opis:** Pobiera aktualny status procesu dołączania na podstawie tokenu.

**Parametry:**
- `token` - token dołączania wygenerowany wcześniej

**Zwraca:** Aktualny obiekt `JoinStatus`

### Oczekiwanie na zmiany statusu

#### `waitAndGetJoinStatusInfo`
```kotlin
suspend fun waitAndGetJoinStatusInfo(token: String): JoinStatusInfo
```

**Opis:** Oczekuje aż status zmieni się z `Pending` i zwraca informacje o dołączeniu.

**Parametry:**
- `token` - token dołączania

**Zwraca:** Obiekt `JoinStatusInfo` z danymi o procesie dołączania

**Proces:**
1. Wykonuje pętlę sprawdzającą status co `BACKEND_REQUEST_INTERVAL_LENGTH_MS` ms
2. Kontynuuje dopóki status pozostaje `JoinStatusState.Pending`
3. Zwraca informacje o dołączeniu lub rzuca wyjątek jeśli dane są null

**Wyjątki:** Rzuca `Exception` gdy `joinStatus` lub `joinStatusInfo` jest null

#### `waitForNotInitiatedStatus`
```kotlin
suspend fun waitForNotInitiatedStatus(token: String): JoinStatus
```

**Opis:** Oczekuje aż status zmieni się z `Initiated` na inny stan.

**Parametry:**
- `token` - token dołączania

**Zwraca:** Obiekt `JoinStatus` po zmianie stanu

**Proces:**
1. Wykonuje pętlę sprawdzającą status co `BACKEND_REQUEST_INTERVAL_LENGTH_MS` ms
2. Kontynuuje dopóki status pozostaje `JoinStatusState.Initiated`
3. Zwraca status po zmianie stanu

### Aktualizacja statusu

#### `changeStateToPending`
```kotlin
suspend fun changeStateToPending(token: String): JoinStatus
```

**Opis:** Zmienia status na `Pending` (w trakcie przetwarzania).

**Parametry:**
- `token` - token dołączania

**Zwraca:** Zaktualizowany obiekt `JoinStatus`

**Uwaga:** Pomimo nazwy metody, faktycznie zmienia status na `Success` z pustymi informacjami

#### `changeStateToSuccess`
```kotlin
suspend fun changeStateToSuccess(token: String, contextId: String): JoinStatus
```

**Opis:** Zmienia status na `Success` z podaniem identyfikatora kontekstu grupy.

**Parametry:**
- `token` - token dołączania
- `contextId` - identyfikator kontekstu grupy rodzinnej

**Zwraca:** Zaktualizowany obiekt `JoinStatus`

**Proces:** Tworzy `JoinStatusInfo` z `contextId` i ustawia status na `Success`

## Metody prywatne

### `changeJoinStatusState`
```kotlin
private suspend fun changeJoinStatusState(
    token: String, 
    joinTokenStatus: JoinStatusState, 
    joinStatusInfo: JoinStatusInfo?
): JoinStatus
```

**Opis:** Wewnętrzna metoda do zmiany stanu join status.

**Parametry:**
- `token` - token dołączania
- `joinTokenStatus` - nowy stan statusu
- `joinStatusInfo` - informacje o dołączeniu (opcjonalne)

## Stany procesu dołączania

- **`Initiated`** - proces został zainicjowany
- **`Pending`** - oczekuje na przetworzenie
- **`Success`** - pomyślnie zakończony

## Konfiguracja

Serwis używa `AppConfig.BACKEND_REQUEST_INTERVAL_LENGTH_MS` do określenia interwału między sprawdzeniami statusu.

## Przepływ procesu dołączania

1. **Opiekun:** Wywołuje `generateJoinStatus()` aby utworzyć token
2. **Kandydat:** Używa token do rozpoczęcia procesu dołączania
3. **System:** Monitoruje status używając `waitAndGetJoinStatusInfo()` lub `waitForNotInitiatedStatus()`
4. **Proces:** Aktualizuje status używając `changeStateToPending()` i `changeStateToSuccess()`

## Uwagi implementacyjne

- Wszystkie operacje oczekiwania używają `delay()` między sprawdzeniami
- Metody oczekiwania działają w pętli do zmiany stanu
- Serwis nie obsługuje timeout'ów - może działać w nieskończoność
- Komunikacja odbywa się wyłącznie przez backend FamilyVault
- Metoda `changeStateToPending()` ma mylącą nazwę - faktycznie ustawia status na `Success`
