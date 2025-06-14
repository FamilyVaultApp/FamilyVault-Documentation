---
sidebar_position: 2
---

# FamilyGroupService


`FamilyGroupService` jest głównym serwisem odpowiedzialnym za zarządzanie grupami rodzinnymi w aplikacji FamilyVault. Obsługuje tworzenie nowych grup rodzinnych, dołączanie do istniejących grup, zarządzanie członkami oraz podstawowe operacje związane z sesjami grup rodzinnych.

## Zależności

Serwis korzysta z następujących komponentów:
- `IFamilyGroupCredentialsRepository` - zarządzanie poświadczeniami grup rodzinnych
- `IFamilyGroupSessionService` - obsługa sesji grup rodzinnych
- `IFamilyVaultBackendClient` - komunikacja z backendem
- `IPrivMxClient` - operacje kryptograficzne i komunikacja z PrivMX
- `ISelfHostedAddressState` - zarządzanie adresami self-hosted

## Metody publiczne

### Zarządzanie grupami rodzinnymi

#### `createFamilyGroupAndAssign`
```kotlin
suspend fun createFamilyGroupAndAssign(
    firstname: String,
    surname: String,
    password: String,
    familyGroupName: String,
    familyGroupDescription: String?
)
```

**Opis:** Tworzy nową grupę rodzinną i automatycznie przypisuje użytkownika jako opiekuna (Guardian).

**Parametry:**
- `firstname` - imię użytkownika
- `surname` - nazwisko użytkownika
- `password` - hasło do szyfrowania klucza prywatnego
- `familyGroupName` - nazwa grupy rodzinnej
- `familyGroupDescription` - opis grupy (opcjonalny)

**Proces:**
1. Generuje parę kluczy publiczny/prywatny
2. Tworzy grupę rodzinną w backendzie
3. Dodaje użytkownika jako opiekuna grupy
4. Ustanawia sesję i łączy się z grupą
5. Zapisuje poświadczenia lokalnie

#### `joinFamilyGroupAndAssign`
```kotlin
suspend fun joinFamilyGroupAndAssign(
    firstname: String,
    surname: String?,
    encryptedPassword: String,
    keyPair: PublicEncryptedPrivateKeyPair,
    contextId: String
)
```

**Opis:** Dołącza do istniejącej grupy rodzinnej używając podanych poświadczeń.

**Parametry:**
- `firstname` - imię użytkownika
- `surname` - nazwisko użytkownika (opcjonalne)
- `encryptedPassword` - zaszyfrowane hasło
- `keyPair` - para kluczy publiczny/zaszyfrowany prywatny
- `contextId` - identyfikator kontekstu grupy

**Proces:**
1. Pobiera informacje o grupie rodzinnej
2. Ustanawia sesję z grupą
3. Łączy się z grupą
4. Zapisuje poświadczenia lokalnie

#### `assignDefaultStoredFamilyGroup`
```kotlin
suspend fun assignDefaultStoredFamilyGroup(): ConnectionStatus
```

**Opis:** Przypisuje domyślną zapisaną grupę rodzinną i próbuje się z nią połączyć.

**Zwraca:** Status połączenia (`ConnectionStatus`)

**Możliwe statusy:**
- `Success` - pomyślne połączenie
- `NoCredentials` - brak zapisanych poświadczeń
- `Error` - błąd połączenia
- `UserNotFound` - użytkownik nie znaleziony w grupie

#### `renameCurrentFamilyGroup`
```kotlin
suspend fun renameCurrentFamilyGroup(name: String)
```

**Opis:** Zmienia nazwę aktualnej grupy rodzinnej.

**Parametry:**
- `name` - nowa nazwa grupy

**Wymagania:**
- Użytkownik musi być opiekunem grupy
- Grupa musi być aktywna

#### `refreshCurrentFamilyGroupName`
```kotlin
suspend fun refreshCurrentFamilyGroupName()
```

**Opis:** Odświeża nazwę aktualnej grupy rodzinnej z serwera i aktualizuje lokalne poświadczenia.

**Zastosowanie:**
- Synchronizacja po zmianie nazwy przez innego użytkownika
- Odświeżanie danych po reconnect

### Zarządzanie członkami

#### `addMemberToFamilyGroup`
```kotlin
suspend fun addMemberToFamilyGroup(
    contextId: String, 
    userId: String, 
    userPubKey: String
)
```

**Opis:** Dodaje nowego członka do grupy rodzinnej.

**Parametry:**
- `contextId` - identyfikator kontekstu grupy
- `userId` - identyfikator użytkownika
- `userPubKey` - klucz publiczny użytkownika

**Wymagania:**
- Użytkownik wykonujący operację musi być opiekunem
- Dodawany użytkownik nie może już być członkiem grupy

#### `removeMemberFromCurrentFamilyGroup`
```kotlin
suspend fun removeMemberFromCurrentFamilyGroup(userPubKey: String)
```

**Opis:** Usuwa członka z aktualnej grupy rodzinnej.

**Parametry:**
- `userPubKey` - klucz publiczny użytkownika do usunięcia

**Wymagania:**
- Tylko opiekun może usuwać członków
- Nie można usunąć samego siebie
- Usuwany użytkownik musi być członkiem grupy

### Pobieranie danych członków

#### `retrieveFamilyGroupMembersList`
```kotlin
suspend fun retrieveFamilyGroupMembersList(): List<FamilyMember>
```

**Opis:** Pobiera listę wszystkich członków aktualnej grupy rodzinnej.

**Zwraca:** Lista obiektów `FamilyMember` zawierająca wszystkich członków grupy

**Struktura FamilyMember:**
```kotlin
data class FamilyMember(
    val userId: String,
    val publicKey: String,
    val firstname: String,
    val surname: String?,
    val role: MemberRole,
    val joinDate: LocalDateTime
)
```

#### `retrieveFamilyGroupMembersWithoutMeList`
```kotlin
suspend fun retrieveFamilyGroupMembersWithoutMeList(): List<FamilyMember>
```

**Opis:** Pobiera listę członków grupy rodzinnej z wykluczeniem aktualnego użytkownika.

**Zwraca:** Lista obiektów `FamilyMember` bez aktualnego użytkownika

**Zastosowanie:**
- Wyświetlanie listy innych członków do wyboru
- Operacje na innych użytkownikach (np. usuwanie)

#### `retrieveMyFamilyMemberData`
```kotlin
suspend fun retrieveMyFamilyMemberData(): FamilyMember
```

**Opis:** Pobiera dane aktualnego użytkownika jako członka grupy rodzinnej.

**Zwraca:** Obiekt `FamilyMember` reprezentujący aktualnego użytkownika

**Zastosowanie:**
- Wyświetlanie profilu użytkownika
- Sprawdzanie uprawnień (rola opiekuna/członka)

#### `retrieveFamilyMemberDataByPublicKey`
```kotlin
suspend fun retrieveFamilyMemberDataByPublicKey(publicKey: String): FamilyMember
```

**Opis:** Pobiera dane członka grupy na podstawie klucza publicznego.

**Parametry:**
- `publicKey` - klucz publiczny członka

**Zwraca:** Obiekt `FamilyMember`

**Zastosowanie:**
- Identyfikacja autora wiadomości/pliku
- Mapowanie kluczy publicznych na profile użytkowników

## Typy danych

### ConnectionStatus
```kotlin
enum class ConnectionStatus {
    Success,
    NoCredentials,
    Error,
    UserNotFound
}
```

### MemberRole
```kotlin
enum class MemberRole {
    Guardian,  // Opiekun - pełne uprawnienia
    Member     // Członek - ograniczone uprawnienia
}
```

## Obsługa błędów

Serwis może zgłaszać następujące wyjątki:

- `FamilyGroupNotFoundException` - grupa nie została znaleziona
- `InsufficientPermissionsException` - brak uprawnień do operacji
- `UserAlreadyMemberException` - użytkownik już jest członkiem grupy
- `NetworkException` - problemy z połączeniem
- `CryptographyException` - błędy szyfrowania/deszyfrowania

## Przykłady użycia

### Tworzenie nowej grupy rodzinnej
```kotlin
try {
    familyGroupService.createFamilyGroupAndAssign(
        firstname = "Jan",
        surname = "Kowalski",
        password = "bezpieczne_haslo",
        familyGroupName = "Rodzina Kowalskich",
        familyGroupDescription = "Nasza rodzinna skrzynka"
    )
    // Grupa została utworzona i użytkownik jest połączony
} catch (e: Exception) {
    // Obsłuż błąd tworzenia grupy
}
```

### Dołączanie do istniejącej grupy
```kotlin
val status = familyGroupService.assignDefaultStoredFamilyGroup()
when (status) {
    ConnectionStatus.Success -> {
        // Pomyślnie połączono z grupą
    }
    ConnectionStatus.NoCredentials -> {
        // Brak zapisanych poświadczeń - wymagane nowe logowanie
    }
    ConnectionStatus.UserNotFound -> {
        // Użytkownik został usunięty z grupy
    }
    ConnectionStatus.Error -> {
        // Błąd połączenia
    }
}
```

### Zarządzanie członkami
```kotlin
// Pobranie listy członków
val members = familyGroupService.retrieveFamilyGroupMembersList()

// Dodanie nowego członka (tylko opiekun)
familyGroupService.addMemberToFamilyGroup(
    contextId = currentContextId,
    userId = newUserId,
    userPubKey = newUserPublicKey
)

// Usunięcie członka (tylko opiekun)
familyGroupService.removeMemberFromCurrentFamilyGroup(memberPublicKey)
```

## Uwagi implementacyjne

- Wszystkie operacje na grupach rodzinnych są asynchroniczne (używają `suspend`)
- Serwis automatycznie zarządza sesjami i połączeniami
- Obsługuje zarówno standardowe jak i self-hosted backendy
- Używa szyfrowania end-to-end dla bezpieczeństwa danych
- Automatycznie zapisuje poświadczenia lokalnie dla przyszłego użycia
- Wymaga aktywnej sesji dla większości operacji
- Operacje zarządzania członkami są ograniczone do opiekunów grup
