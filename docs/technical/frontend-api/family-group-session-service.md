---
sidebar_position: 3
---

# FamilyGroupSessionService

## Opis ogólny

`FamilyGroupSessionService` jest kluczowym serwisem odpowiedzialnym za zarządzanie sesjami grup rodzinnych w aplikacji FamilyVault. Obsługuje tworzenie i utrzymywanie połączeń z grupami rodzinnymi, zarządzanie danymi sesji użytkownika oraz przechowywanie informacji o aktualnie zalogowanym użytkowniku.

## Zależności

Serwis korzysta z następujących komponentów:
- `IPrivMxClient` - komunikacja z PrivMX i operacje kryptograficzne
- `IFamilyVaultBackendClient` - komunikacja z backendem FamilyVault

## Właściwości prywatne

- `session: FamilyGroupSession?` - przechowuje dane aktualnej sesji
- `currentUser: FamilyMember?` - przechowuje dane aktualnie zalogowanego użytkownika

## Metody publiczne

### Zarządzanie sesjami

#### `assignSession` (z poświadczeniami)
```kotlin
suspend fun assignSession(familyGroupCredential: FamilyGroupCredential)
```

**Opis:** Przypisuje sesję na podstawie zapisanych poświadczeń grupy rodzinnej.

**Parametry:**
- `familyGroupCredential` - zapisane poświadczenia grupy rodzinnej

**Proces:**
1. Pobiera adres bridge'a z backendu
2. Wyciąga wszystkie niezbędne dane z poświadczeń
3. Wywołuje główną metodę `assignSession`

#### `assignSession` (z parametrami)
```kotlin
fun assignSession(
    bridgeUrl: String,
    backendUrl: String?,
    familyGroupName: String,
    solutionId: String,
    contextId: String,
    keyPair: PublicEncryptedPrivateKeyPair
)
```

**Opis:** Przypisuje sesję na podstawie podanych parametrów.

**Parametry:**
- `bridgeUrl` - adres URL bridge'a PrivMX
- `backendUrl` - adres URL backendu (opcjonalny dla self-hosted)
- `familyGroupName` - nazwa grupy rodzinnej
- `solutionId` - identyfikator rozwiązania
- `contextId` - identyfikator kontekstu grupy
- `keyPair` - para kluczy publiczny/zaszyfrowany prywatny

**Proces:**
1. Deszyfruje klucz prywatny z hasła
2. Tworzy obiekt `FamilyGroupSession`
3. Zapisuje sesję w pamięci

### Zarządzanie połączeniami

#### `connect`
```kotlin
suspend fun connect(): ConnectionStatus
```

**Opis:** Nawiązuje połączenie z grupą rodzinną i pobiera dane użytkownika.

**Zwraca:** Status połączenia (`ConnectionStatus`)

**Możliwe statusy:**
- `Success` - pomyślne połączenie
- `UserNotFound` - użytkownik nie znaleziony w grupie

**Proces:**
1. Ustawia odpowiedni backend URL (standardowy lub self-hosted)
2. Nawiązuje połączenie PrivMX z bridge'em
3. Pobiera dane aktualnego użytkownika z backendu
4. Obsługuje błędy związane z brakiem użytkownika w kontekście

#### `disconnect`
```kotlin
fun disconnect()
```

**Opis:** Rozłącza aktualną sesję i czyści dane.

**Proces:**
1. Rozłącza klienta PrivMX
2. Usuwa dane sesji z pamięci

### Gettery danych sesji

#### `getContextId`
```kotlin
fun getContextId(): String
```

**Opis:** Pobiera identyfikator kontekstu aktualnej grupy rodzinnej.

**Zwraca:** Identyfikator kontekstu

**Wymagania:** Sesja musi być przypisana

#### `getPrivateKey`
```kotlin
fun getPrivateKey(): String
```

**Opis:** Pobiera odszyfrowany klucz prywatny użytkownika.

**Zwraca:** Klucz prywatny w formie String

**Wymagania:** Sesja musi być przypisana

#### `getPublicKey`
```kotlin
fun getPublicKey(): String
```

**Opis:** Pobiera klucz publiczny użytkownika.

**Zwraca:** Klucz publiczny w formie String

**Wymagania:** Sesja musi być przypisana

#### `getBridgeUrl`
```kotlin
fun getBridgeUrl(): String
```

**Opis:** Pobiera adres URL bridge'a PrivMX.

**Zwraca:** Adres URL bridge'a

**Wymagania:** Sesja musi być przypisana

#### `getSolutionId`
```kotlin
fun getSolutionId(): String
```

**Opis:** Pobiera identyfikator rozwiązania.

**Zwraca:** Identyfikator rozwiązania

**Wymagania:** Sesja musi być przypisana

#### `getCurrentUser`
```kotlin
fun getCurrentUser(): FamilyMember
```

**Opis:** Pobiera dane aktualnie zalogowanego użytkownika.

**Zwraca:** Obiekt `FamilyMember` reprezentujący aktualnego użytkownika

**Wymagania:** Wymagane wcześniejsze pomyślne połączenie przez `connect()`

### Zarządzanie danymi grupy

#### `getFamilyGroupName`
```kotlin
fun getFamilyGroupName(): String
```

**Opis:** Pobiera nazwę aktualnej grupy rodzinnej.

**Zwraca:** Nazwa grupy rodzinnej

**Wymagania:** Sesja musi być przypisana

#### `updateFamilyGroupName`
```kotlin
fun updateFamilyGroupName(name: String)
```

**Opis:** Aktualizuje nazwę grupy rodzinnej w sesji.

**Parametry:**
- `name` - nowa nazwa grupy

**Wymagania:** Sesja musi być przypisana

### Zarządzanie stanem sesji

#### `isSessionAssigned`
```kotlin
fun isSessionAssigned(): Boolean
```

**Opis:** Sprawdza czy sesja została przypisana.

**Zwraca:** `true` jeśli sesja jest przypisana, `false` w przeciwnym razie

## Typy danych

### FamilyGroupSession
```kotlin
data class FamilyGroupSession(
    val bridgeUrl: String,           // Adres bridge'a PrivMX
    val backendUrl: String?,         // Adres backendu (null dla self-hosted)
    val familyGroupName: String,     // Nazwa grupy rodzinnej
    val solutionId: String,          // Identyfikator rozwiązania
    val contextId: String,           // Identyfikator kontekstu grupy
    val keyPair: PublicPrivateKeyPair // Para kluczy (odszyfrowana)
)
```

### ConnectionStatus
```kotlin
enum class ConnectionStatus {
    Success,       // Pomyślne połączenie
    NoCredentials, // Brak zapisanych poświadczeń
    Error,         // Błąd połączenia
    UserNotFound   // Użytkownik nie znaleziony w grupie
}
```

## Obsługa błędów

Serwis może zgłaszać następujące wyjątki:

- `IllegalStateException` - gdy próbuje się dostać do danych nieprzypisanej sesji
- `UserNotInContextException` - automatycznie obsługiwane jako `ConnectionStatus.UserNotFound`
- `NetworkException` - problemy z połączeniem sieciowym
- `CryptographyException` - błędy szyfrowania/deszyfrowania kluczy

## Przykłady użycia

### Przypisywanie sesji z poświadczeniami
```kotlin
// Z zapisanych poświadczeń
val credentials = familyGroupCredentialsRepository.getCredentials()
familyGroupSessionService.assignSession(credentials)

// Sprawdzenie czy sesja została przypisana
if (familyGroupSessionService.isSessionAssigned()) {
    // Sesja gotowa do użycia
}
```

### Nawiązywanie połączenia
```kotlin
if (familyGroupSessionService.isSessionAssigned()) {
    val status = familyGroupSessionService.connect()
    when (status) {
        ConnectionStatus.Success -> {
            val currentUser = familyGroupSessionService.getCurrentUser()
            // Połączenie pomyślne, użytkownik zalogowany
        }
        ConnectionStatus.UserNotFound -> {
            // Użytkownik został usunięty z grupy
        }
    }
}
```

### Pobieranie danych sesji
```kotlin
// Sprawdzenie czy sesja jest przypisana
if (familyGroupSessionService.isSessionAssigned()) {
    val contextId = familyGroupSessionService.getContextId()
    val groupName = familyGroupSessionService.getFamilyGroupName()
    val publicKey = familyGroupSessionService.getPublicKey()
    
    // Aktualizacja nazwy grupy
    familyGroupSessionService.updateFamilyGroupName("Nowa nazwa")
}
```

### Rozłączanie sesji
```kotlin
// Graceful disconnect
familyGroupSessionService.disconnect()

// Sprawdzenie stanu po rozłączeniu
val isAssigned = familyGroupSessionService.isSessionAssigned() // false
```

## Uwagi implementacyjne

- Serwis obsługuje zarówno standardowe jak i self-hosted backendy
- Automatycznie zarządza szyfrowaniem/deszyfrowaniem kluczy prywatnych
- Sesja jest przechowywana tylko w pamięci (nie persystuje między restartami aplikacji)
- Dane użytkownika są pobierane dopiero po nawiązaniu połączenia przez `connect()`
- Wszystkie operacje na danych sesji wymagają wcześniejszego przypisania sesji
- Obsługuje graceful disconnect z czyszczeniem wszystkich danych
- Automatyczna detekcja i obsługa self-hosted instancji
- Bezpieczne przechowywanie odszyfrowanych kluczy tylko w pamięci

## Bezpieczeństwo

- Klucze prywatne są deszyfrowane tylko w pamięci
- Automatyczne czyszczenie danych sesji przy rozłączeniu
- Obsługa błędów związanych z usunięciem użytkownika z grupy
- Bezpieczne zarządzanie połączeniami PrivMX
- Walidacja stanu sesji przed każdą operacją

## Cykl życia sesji

1. **Przypisanie** - `assignSession()` z poświadczeniami lub parametrami
2. **Połączenie** - `connect()` nawiązuje połączenie i pobiera dane użytkownika
3. **Użytkowanie** - dostęp do danych przez gettery
4. **Rozłączenie** - `disconnect()` czyści wszystkie dane

Każdy krok wymaga pomyślnego wykonania poprzedniego kroku.
