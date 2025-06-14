# PrivMxSolutionProvider

`PrivMxSolutionProvider` to serwis odpowiedzialny za zarządzanie identyfikatorem rozwiązania PrivMX. Implementuje interfejs `IPrivMxSolutionProvider` i zapewnia mechanizm pobierania lub tworzenia identyfikatora rozwiązania z obsługą persystencji lokalnej.

## Przestrzeń nazw

```csharp
FamilyVaultServer.Services.PrivMx
```

## Implementacja interfejsu

Implementuje `IPrivMxSolutionProvider`

## Pola prywatne

### `_privMxService`
```csharp
private IPrivMxService _privMxService;
```
Instancja serwisu PrivMX używana do tworzenia nowych rozwiązań.

### `_solutionName`
```csharp
private string _solutionName;
```
Nazwa rozwiązania używana podczas tworzenia nowego rozwiązania.

## Konstruktor

```csharp
public PrivMxSolutionProvider(IPrivMxService privMxService, string solutionName)
```

**Parametry:**
- `privMxService` - serwis PrivMX implementujący `IPrivMxService`
- `solutionName` - nazwa rozwiązania

**Opis:** Konstruktor wykorzystuje primary constructor syntax z C# 12 do inicjalizacji pól prywatnych.

## Metody publiczne

### `GetSolutionId()`
```csharp
public async Task<string> GetSolutionId()
```

**Zwraca:**
- `Task<string>` - identyfikator rozwiązania

**Opis:** Pobiera identyfikator rozwiązania z lokalnego pliku lub tworzy nowe rozwiązanie jeśli plik nie istnieje.

**Działanie:**
1. Wywołuje `GetSolutionIdFromFileOrNull()` aby sprawdzić czy identyfikator istnieje lokalnie
2. Jeśli identyfikator nie istnieje:
   - Tworzy nowe rozwiązanie poprzez `_privMxService.CreateSolution(_solutionName)`
   - Pobiera identyfikator z wyniku utworzenia
   - Zapisuje identyfikator do pliku poprzez `SaveSolutionIdInFile(solutionId)`
3. Zwraca identyfikator rozwiązania

## Metody prywatne

### `GetSolutionIdFromFileOrNull()`
```csharp
private string? GetSolutionIdFromFileOrNull()
```

**Zwraca:**
- `string?` - identyfikator rozwiązania z pliku lub `null` jeśli plik nie istnieje

**Działanie:**
1. Sprawdza czy plik pod ścieżką `SolutionIdFilePath` istnieje
2. Jeśli plik istnieje, odczytuje i zwraca jego zawartość
3. Jeśli plik nie istnieje, zwraca `null`

### `SaveSolutionIdInFile(string solutionId)`
```csharp
private void SaveSolutionIdInFile(string solutionId)
```

**Parametry:**
- `solutionId` - identyfikator rozwiązania do zapisania

**Działanie:**
1. Pobiera katalog nadrzędny dla pliku z `SolutionIdFilePath`
2. Tworzy katalog jeśli nie istnieje poprzez `Directory.CreateDirectory(directory)`
3. Zapisuje identyfikator do pliku poprzez `File.WriteAllText(SolutionIdFilePath, solutionId)`

## Właściwości prywatne

### `SolutionIdFilePath`
```csharp
private string SolutionIdFilePath => Path.Combine(AppContext.BaseDirectory, "config/solution");
```

**Zwraca:**
- `string` - pełna ścieżka do pliku przechowującego identyfikator rozwiązania

**Opis:** Zwraca ścieżkę do pliku `solution` w katalogu `config` względem katalogu bazowego aplikacji.

## Persystencja danych

### Lokalizacja pliku
Identyfikator rozwiązania jest przechowywany w pliku:
```
{AppContext.BaseDirectory}/config/solution
```

### Struktura katalogu
Serwis automatycznie tworzy strukturę katalogów jeśli nie istnieje:
- Katalog `config` jest tworzony automatycznie
- Plik `solution` zawiera identyfikator w formacie tekstowym

## Logika działania

1. **Pierwsze uruchomienie:**
   - Plik nie istnieje
   - Tworzy nowe rozwiązanie w PrivMX
   - Zapisuje identyfikator do pliku

2. **Kolejne uruchomienia:**
   - Plik istnieje
   - Odczytuje identyfikator z pliku
   - Nie tworzy nowego rozwiązania

## Zależności

### Wykorzystywane serwisy:
- `IPrivMxService` - do tworzenia nowych rozwiązań

### Wykorzystywane modele:
- `PrivMxCreateSolutionResult` - wynik tworzenia rozwiązania

## Użycie

Serwis jest wykorzystywany przez `PrivMxService` do pobierania identyfikatora rozwiązania wymaganego przy tworzeniu kontekstów w aplikacji Family Vault.

**Przykład użycia w PrivMxService:**
```csharp
_solutionProvider = new PrivMxSolutionProvider(this, _options.Value.SolutionName);
```
