# PrivMxService

`PrivMxService` to główny serwis odpowiedzialny za komunikację z platformą PrivMX Bridge. Implementuje interfejs `IPrivMxService` i zarządza operacjami związanymi z kontekstami, użytkownikami oraz rozwiązaniami w systemie PrivMX.


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

### `_options`
```csharp
private IOptions<PrivMxOptions> _options;
```

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

### `CreateSolution(string name)`
```csharp
public Task<PrivMxCreateSolutionResult> CreateSolution(string name)
```

### `CreateContext(string name, string description, string scope)`
```csharp
public async Task<PrivMxCreateContextResult> CreateContext(string name, string description, string scope)
```

**Opis:** Tworzy nowy kontekst w ramach rozwiązania z domyślną polityką.

### `AddUserToContext(string contextId, string userId, string userPubKey, string acl)`
```csharp
public Task<bool> AddUserToContext(string contextId, string userId, string userPubKey, string acl)
```

### `ListUsersFromContext(string contextId, int skip, int limit, string sortOrder)`
```csharp
public Task<PrivMxListUsersFromContextResult> ListUsersFromContext(string contextId, int skip, int limit, string sortOrder)
```

**Opis:** Pobiera listę użytkowników z określonego kontekstu z możliwością stronicowania.

### `GetUserFromContext(string contextId, string userId)`
```csharp
public Task<PrivMxGetUserFromContextResult> GetUserFromContext(string contextId, string userId)
```

### `GetUserFromContextByPubKey(string contextId, string publicKey)`
```csharp
public Task<PrivMxGetUserFromContextResult> GetUserFromContextByPubKey(string contextId, string publicKey)
```

### `UpdateContext(string contextId, string? name, string? description, string? scope, string? policy)`
```csharp
public Task<bool> UpdateContext(string contextId, string? name = null, string? description = null, string? scope = null, string? policy = null)
```

**Opis:** Aktualizuje właściwości kontekstu. Parametry `null` nie są modyfikowane.

### `SetUserAcl(string contextId, string userId, string acl)`
```csharp
public Task<bool> SetUserAcl(string contextId, string userId, string acl)
```

### `RemoveUserFromContextByPubKey(string contextId, string userPubKey)`
```csharp
public Task<bool> RemoveUserFromContextByPubKey(string contextId, string userPubKey)
```

### `GetContext(string contextId)`
```csharp
public Task<PrivMxGetContext> GetContext(string contextId)
```

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
