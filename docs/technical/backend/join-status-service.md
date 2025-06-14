# JoinStatusService - Dokumentacja

## Opis

`JoinStatusService` to serwis odpowiedzialny za zarządzanie statusami dołączania członków do grupy rodzinnej. Implementuje interfejs `IJoinStatusService` i służy do śledzenia procesu dołączania nowych użytkowników.

## Przestrzeń nazw

```csharp
FamilyVaultServer.Services.MemberJoinToken
```

## Implementacja interfejsu

Implementuje `IJoinStatusService`

## Pola

### `joinStatuses`
```csharp
private List<JoinStatus> joinStatuses = [];
```
Prywatna lista przechowująca wszystkie aktywne statusy dołączania.

## Metody

### `GenerateNew()`
```csharp
public JoinStatus GenerateNew()
```

**Opis:** Generuje nowy status dołączania z unikalnym tokenem.

**Zwraca:** 
- `JoinStatus` - nowy obiekt statusu z wygenerowanym tokenem i stanem `Initiated`

**Działanie:**
1. Tworzy nowy obiekt `JoinStatus` poprzez wywołanie `JoinStatus.New()`
2. Dodaje go do listy `joinStatuses`
3. Zwraca utworzony status

### `Delete(Guid token)`
```csharp
public void Delete(Guid token)
```

**Parametry:**
- `token` - unikalny identyfikator statusu do usunięcia

**Opis:** Usuwa status dołączania o podanym tokenie z listy.

**Działanie:**
- Usuwa wszystkie statusy z listy `joinStatuses`, które mają pasujący token

### `GetStatusByToken(Guid token)`
```csharp
public JoinStatus? GetStatusByToken(Guid token)
```

**Parametry:**
- `token` - unikalny identyfikator statusu

**Zwraca:**
- `JoinStatus`? - znaleziony status lub `null` jeśli nie istnieje

**Opis:** Wyszukuje i zwraca status dołączania na podstawie tokenu.

### `UpdateInfo(Guid token, JoinStatusInfo info)`
```csharp
public JoinStatus? UpdateInfo(Guid token, JoinStatusInfo info)
```

**Parametry:**
- `token` - unikalny identyfikator statusu
- `info` - nowe informacje do zaktualizowania (`JoinStatusInfo`)

**Zwraca:**
- `JoinStatus`? - zaktualizowany status lub `null` jeśli nie istnieje

**Opis:** Aktualizuje informacje w statusie dołączania.

**Działanie:**
1. Wyszukuje status po tokenie
2. Jeśli status istnieje, aktualizuje pole `Info`
3. Zwraca zaktualizowany status

### `UpdateStatus(Guid token, JoinStatusState status)`
```csharp
public JoinStatus? UpdateStatus(Guid token, JoinStatusState status)
```

**Parametry:**
- `token` - unikalny identyfikator statusu
- `status` - nowy stan statusu (`JoinStatusState`)

**Zwraca:**
- `JoinStatus`? - zaktualizowany status lub `null` jeśli nie istnieje

**Opis:** Aktualizuje stan statusu dołączania.

**Działanie:**
1. Wyszukuje status po tokenie
2. Jeśli status istnieje, aktualizuje pole `State`
3. Zwraca zaktualizowany status

## Modele powiązane

### JoinStatusState (enum)
- `Initiated = 0` - proces zainicjowany
- `Pending = 1` - oczekujący
- `Success = 2` - zakończony sukcesem
- `Error = 3` - zakończony błędem

### JoinStatusInfo
Zawiera dodatkowe informacje o statusie:
- `ContextId` - identyfikator kontekstu
- `Error` - komunikat błędu (jeśli wystąpił)

### JoinStatus
Główny model statusu zawierający:
- `Token` - unikalny identyfikator
- `State` - aktualny stan
- `Info` - dodatkowe informacje
