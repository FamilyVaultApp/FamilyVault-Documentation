# PrivMxBridgeClient - Dokumentacja

## Opis

`PrivMxBridgeClient` to klient HTTP odpowiedzialny za komunikację z zewnętrznym API PrivMX Bridge. Implementuje interfejs `IPrivMxBridgeClient` i służy do wykonywania zapytań RPC do serwera PrivMX Bridge.

## Przestrzeń nazw

```csharp
FamilyVaultServer.Services.PrivMx
```

## Implementacja interfejsu

Implementuje `IPrivMxBridgeClient`

## Pola prywatne

### `_httpClient`
```csharp
private readonly HttpClient _httpClient;
```
Klient HTTP skonfigurowany do komunikacji z PrivMX Bridge API.

### `_options`
```csharp
private readonly PrivMxOptions _options;
```
Opcje konfiguracyjne zawierające dane do połączenia z PrivMX Bridge.

## Konstruktor

```csharp
public PrivMxBridgeClient(PrivMxOptions options)
```

**Parametry:**
- `options` - opcje konfiguracyjne typu `PrivMxOptions`

**Działanie:**
1. Zapisuje opcje konfiguracyjne
2. Inicjalizuje klienta HTTP poprzez wywołanie `InitializeHttpClient()`

## Metody publiczne

### `ExecuteMethodWithOperationStatus<TRequestParameters>(string methodName, TRequestParameters parameters)`
```csharp
public async Task<bool> ExecuteMethodWithOperationStatus<TRequestParameters>(string methodName, TRequestParameters parameters)
    where TRequestParameters : PrivMxRequestParameters
```

**Parametry:**
- `methodName` - nazwa metody RPC do wywołania
- `parameters` - parametry zapytania dziedziczące po `PrivMxRequestParameters`

**Zwraca:**
- `Task<bool>` - `true` jeśli operacja zakończyła się sukcesem (`"OK"`), `false` w przeciwnym przypadku

**Opis:** Wykonuje zapytanie RPC i sprawdza status operacji na podstawie odpowiedzi tekstowej.

### `ExecuteMethodWithResponse<TRequestParameters, TResponseResult>(string methodName, TRequestParameters parameters)`
```csharp
public async Task<TResponseResult> ExecuteMethodWithResponse<TRequestParameters, TResponseResult>(string methodName, TRequestParameters parameters)
    where TRequestParameters : PrivMxRequestParameters
    where TResponseResult : PrivMxResponseResult
```

**Parametry:**
- `methodName` - nazwa metody RPC do wywołania
- `parameters` - parametry zapytania dziedziczące po `PrivMxRequestParameters`

**Typ generyczny:**
- `TResponseResult` - typ odpowiedzi dziedziczący po `PrivMxResponseResult`

**Zwraca:**
- `Task<TResponseResult>` - odpowiedź w określonym typie

**Opis:** Wykonuje zapytanie RPC i deserializuje odpowiedź do określonego typu.

## Metody prywatne

### `SendRequest<TRequestParameters, TResponseResult>(string methodName, TRequestParameters parameters)`
```csharp
private async Task<TResponseResult> SendRequest<TRequestParameters, TResponseResult>(string methodName, TRequestParameters parameters)
    where TRequestParameters : PrivMxRequestParameters
    where TResponseResult : class
```

**Działanie:**
1. Wysyła zapytanie HTTP poprzez `SendRequestAndGetResponseStream()`
2. Deserializuje odpowiedź do typu `PrivMxResponse<TResponseResult>`
3. Sprawdza błędy w odpowiedzi i rzuca `PrivMxBridgeException` w przypadku błędu
4. Zwraca wynik z pola `Result`

### `SendRequestAndGetResponseStream<TRequestParameters>(PrivMxRequest<TRequestParameters> request)`
```csharp
private async Task<Stream> SendRequestAndGetResponseStream<TRequestParameters>(PrivMxRequest<TRequestParameters> request)
    where TRequestParameters : PrivMxRequestParameters
```

**Działanie:**
1. Konfiguruje opcje serializacji JSON (ignoruje wartości `null`)
2. Wysyła zapytanie POST do endpointu `"api"`
3. Sprawdza status odpowiedzi HTTP
4. Zwraca strumień odpowiedzi

### `InitializeHttpClient()`
```csharp
private HttpClient InitializeHttpClient()
```

**Zwraca:**
- `HttpClient` - skonfigurowany klient HTTP

**Działanie:**
1. Tworzy nowy `HttpClient`
2. Ustawia nagłówek autoryzacji Basic Auth poprzez `GetAuthorizationHeader()`
3. Ustawia adres bazowy z opcji konfiguracyjnych

### `GetAuthorizationHeader()`
```csharp
private string GetAuthorizationHeader()
```

**Zwraca:**
- `string` - zakodowany nagłówek autoryzacji Base64

**Działanie:**
1. Pobiera `ApiKeyId` i `ApiKeySecret` z opcji
2. Tworzy ciąg `"apiKeyId:apiSecret"`
3. Koduje do Base64 dla autoryzacji Basic Auth

## Obsługa błędów

### PrivMxBridgeException
Klient rzuca wyjątek `PrivMxBridgeException` w następujących przypadkach:

1. **Błąd API PrivMX Bridge:**
   ```
   PrivMX Bridge Error: {kod}: {wiadomość}
   ```

2. **Pusta odpowiedź:**
   ```
   PrivMX Bridge result is empty
   ```

3. **Błąd HTTP:**
   ```
   Error while sending request to PrivMX Bridge: {statusCode}
   ```

## Konfiguracja JSON

Klient używa następujących opcji serializacji:
- `DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull` - ignoruje pola z wartością `null`

## Autoryzacja

Używa autoryzacji **Basic Auth** z danymi:
- Nazwa użytkownika: `ApiKeyId` z `PrivMxOptions`
- Hasło: `ApiKeySecret` z `PrivMxOptions`

## Endpoint

Wszystkie zapytania są wysyłane na endpoint:
```
{BaseUrl}/api
```

gdzie `BaseUrl` pochodzi z pola `Url` w `PrivMxOptions`.

## Wykorzystywane modele

### Zapytania:
- `PrivMxRequest<T>` - struktura zapytania RPC

### Odpowiedzi:
- `PrivMxResponse<T>` - struktura odpowiedzi RPC
- `PrivMxResponseError` - informacje o błędach
