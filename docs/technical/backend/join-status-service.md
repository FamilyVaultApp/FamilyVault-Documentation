# JoinStatusService

`JoinStatusService` to serwis odpowiedzialny za zarządzanie statusami dołączania członków do grupy rodzinnej. Implementuje interfejs `IJoinStatusService` i służy do śledzenia procesu dołączania nowych użytkowników.

## Pola

### `joinStatuses`
```csharp
private List<JoinStatus> joinStatuses = [];
```

## Metody

### `GenerateNew()`
```csharp
public JoinStatus GenerateNew()
```

**Działanie:**
1. Tworzy nowy obiekt `JoinStatus` poprzez wywołanie `JoinStatus.New()`
2. Dodaje go do listy `joinStatuses`
3. Zwraca utworzony status

### `Delete(Guid token)`
```csharp
public void Delete(Guid token)
```

### `GetStatusByToken(Guid token)`
```csharp
public JoinStatus? GetStatusByToken(Guid token)
```

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
