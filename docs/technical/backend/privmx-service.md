# PrivMxService - Dokumentacja

## Opis

`PrivMxService` to główny serwis odpowiedzialny za komunikację z platformą PrivMX Bridge. Implementuje interfejs `IPrivMxService` i zarządza operacjami związanymi z kontekstami, użytkownikami oraz rozwiązaniami w systemie PrivMX.

## Przestrzeń nazw

```csharp
FamilyVaultServer.Services.PrivMx
```

## Implementacja interfejsu

Implementuje `IPrivMxService`

## Pola prywatne

### `_client`
```csharp
private IPrivMxBridgeClient _client;
```
Klient komunikacji z PrivMX Bridge implementujący `IPrivMxBridgeClient`.

### `_solutionProvider`
```csharp
private IPrivMxSolutionProvider _solutionProvider;
```
Dostawca identyfikatora rozwiązania implementujący `IPrivMxSolutionProvider`.

### `_options`
```csharp
private IOptions<PrivMxOptions> _options;
```
Opcje konfiguracyjne dla PrivMX.

## Konstruktor

```csharp
public PrivMxService(IOptions<PrivMxOptions> options)
```

**Parametry:**
- `options` - opcje konfiguracyjne zawierające ustawienia połączenia z PrivMX

**Działanie:**
1. Inicjalizuje klienta `PrivMxBridgeClient`
2. Tworzy dostawcę rozwiązania `PrivMxSolutionProvider`

## Metody

### `GetSolutionId()`
```csharp
public Task<string> GetSolutionId()
```

**Zwraca:** 
- `Task<string>` - identyfikator rozwiązania

**Opis:** Pobiera identyfikator rozwiązania z dostawcy.

### `CreateSolution(string name)`
```csharp
public Task<PrivMxCreateSolutionResult> CreateSolution(string name)
```

**Parametry:**
- `name` - nazwa rozwiązania

**Zwraca:**
- `PrivMxCreateSolutionResult` - wynik utworzenia rozwiązania

**Opis:** Tworzy nowe rozwiązanie w systemie PrivMX.

### `CreateContext(string name, string description, string scope)`
```csharp
public async Task<PrivMxCreateContextResult> CreateContext(string name, string description, string scope)
```

**Parametry:**
- `name` - nazwa kontekstu
- `description` - opis kontekstu
- `scope` - zakres kontekstu

**Zwraca:**
- `PrivMxCreateContextResult` - wynik utworzenia kontekstu

**Opis:** Tworzy nowy kontekst w ramach rozwiązania z domyślną polityką.

### `AddUserToContext(string contextId, string userId, string userPubKey, string acl)`
```csharp
public Task<bool> AddUserToContext(string contextId, string userId, string userPubKey, string acl)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `userId` - identyfikator użytkownika
- `userPubKey` - klucz publiczny użytkownika
- `acl` - lista kontroli dostępu

**Zwraca:**
- `Task<bool>` - status operacji

**Opis:** Dodaje użytkownika do kontekstu z określonymi uprawnieniami.

### `ListUsersFromContext(string contextId, int skip, int limit, string sortOrder)`
```csharp
public Task<PrivMxListUsersFromContextResult> ListUsersFromContext(string contextId, int skip, int limit, string sortOrder)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `skip` - liczba elementów do pominięcia
- `limit` - maksymalna liczba zwracanych elementów
- `sortOrder` - kolejność sortowania

**Zwraca:**
- `PrivMxListUsersFromContextResult` - lista użytkowników kontekstu

**Opis:** Pobiera listę użytkowników z określonego kontekstu z możliwością stronicowania.

### `GetUserFromContext(string contextId, string userId)`
```csharp
public Task<PrivMxGetUserFromContextResult> GetUserFromContext(string contextId, string userId)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `userId` - identyfikator użytkownika

**Zwraca:**
- `PrivMxGetUserFromContextResult` - dane użytkownika

**Opis:** Pobiera dane użytkownika z kontekstu na podstawie identyfikatora użytkownika.

### `GetUserFromContextByPubKey(string contextId, string publicKey)`
```csharp
public Task<PrivMxGetUserFromContextResult> GetUserFromContextByPubKey(string contextId, string publicKey)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `publicKey` - klucz publiczny użytkownika

**Zwraca:**
- `PrivMxGetUserFromContextResult` - dane użytkownika

**Opis:** Pobiera dane użytkownika z kontekstu na podstawie klucza publicznego.

### `UpdateContext(string contextId, string? name, string? description, string? scope, string? policy)`
```csharp
public Task<bool> UpdateContext(string contextId, string? name = null, string? description = null, string? scope = null, string? policy = null)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `name` - nowa nazwa (opcjonalna)
- `description` - nowy opis (opcjonalny)
- `scope` - nowy zakres (opcjonalny)
- `policy` - nowa polityka (opcjonalna)

**Zwraca:**
- `Task<bool>` - status operacji

**Opis:** Aktualizuje właściwości kontekstu. Parametry `null` nie są modyfikowane.

### `SetUserAcl(string contextId, string userId, string acl)`
```csharp
public Task<bool> SetUserAcl(string contextId, string userId, string acl)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `userId` - identyfikator użytkownika
- `acl` - nowa lista kontroli dostępu

**Zwraca:**
- `Task<bool>` - status operacji

**Opis:** Ustawia uprawnienia użytkownika w kontekście.

### `RemoveUserFromContextByPubKey(string contextId, string userPubKey)`
```csharp
public Task<bool> RemoveUserFromContextByPubKey(string contextId, string userPubKey)
```

**Parametry:**
- `contextId` - identyfikator kontekstu
- `userPubKey` - klucz publiczny użytkownika

**Zwraca:**
- `Task<bool>` - status operacji

**Opis:** Usuwa użytkownika z kontekstu na podstawie klucza publicznego.

### `GetContext(string contextId)`
```csharp
public Task<PrivMxGetContext> GetContext(string contextId)
```

**Parametry:**
- `contextId` - identyfikator kontekstu

**Zwraca:**
- `PrivMxGetContext` - dane kontekstu

**Opis:** Pobiera szczegółowe informacje o kontekście.

## Zależności

### Wykorzystywane serwisy:
- `PrivMxBridgeClient` - klient komunikacji z PrivMX Bridge
- `PrivMxSolutionProvider` - dostawca identyfikatora rozwiązania

### Wykorzystywane modele:
- `PrivMxCreateContextParameters`
- `PrivMxCreateSolutionParameters`
- `PrivMxAddUserToContextParameters`
- `PrivMxListUsersFromContextParemeters`
- `PrivMxGetUserFromContextParameters`
- `PrivMxGetUserFromContextByPubKeyParameters`
- `PrivMxUpdateContextParameters`
- `PrivMxSetUserAclParameters`
- `PrivMxRemoveUserFromContextByPubKeyParameters`
- `PrivMxGetContextParameters`

### Wykorzystywane polityki:
- `Policies.Default` - domyślna polityka kontekstu
