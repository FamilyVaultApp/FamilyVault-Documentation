---
sidebar_position: 4
---

# FamilyMemberAdditionService


`FamilyMemberAdditionService` jest serwisem odpowiedzialnym za zarządzanie procesem dodawania nowych członków do grup rodzinnych w aplikacji FamilyVault. Obsługuje dodawanie nowych użytkowników do grupy oraz wykonywanie niezbędnych operacji po dołączeniu użytkownika do grupy rodzinnej.

## Zależności

Serwis korzysta z następujących komponentów:
- `IFamilyVaultBackendClient` - komunikacja z backendem FamilyVault
- `IFamilyGroupSessionService` - zarządzanie sesją grupy rodzinnej
- `IChatService` - obsługa czatów
- `IFileCabinetService` - zarządzanie szafą plików
- `ITaskService` - zarządzanie zadaniami

## Metody publiczne

### `addMemberToFamilyGroup`
```kotlin
suspend fun addMemberToFamilyGroup(
    contextId: String, 
    newFamilyMember: NewFamilyMemberData
)
```

**Opis:** Dodaje nowego członka do grupy rodzinnej i przywraca uprawnienia we wszystkich systemach.

**Parametry:**
- `contextId` - identyfikator kontekstu grupy rodzinnej
- `newFamilyMember` - dane nowego członka rodziny zawierające:
  - `id` - identyfikator użytkownika
  - `keyPair` - para kluczy zawierająca klucz publiczny

**Proces:**
1. Wysyła żądanie do backendu o dodanie członka do grupy
2. Przywraca uprawnienia nowego członka w szafie plików
3. Przywraca uprawnienia w listach zadań

**Uwagi:**
- Operacja jest asynchroniczna i wymaga połączenia z backendem
- Automatycznie aktualizuje uprawnienia we wszystkich istniejących zasobach grupy

### `afterJoinedToFamilyMembersOperations`
```kotlin
suspend fun afterJoinedToFamilyMembersOperations()
```

**Opis:** Wykonuje niezbędne operacje po dołączeniu aktualnego użytkownika do grupy rodzinnej.

**Proces:**
1. Pobiera dane aktualnego użytkownika z sesji
2. Tworzy czaty indywidualne z wszystkimi istniejącymi członkami grupy

**Zastosowanie:**
- Wywoływana po pomyślnym dołączeniu do grupy rodzinnej
- Zapewnia, że nowy członek ma dostęp do komunikacji z wszystkimi członkami
- Automatycznie konfiguruje infrastrukturę komunikacyjną

## Model danych

### NewFamilyMemberData
```kotlin
data class NewFamilyMemberData(
    val id: String,              // Identyfikator użytkownika
    val keyPair: KeyPairData     // Para kluczy zawierająca klucz publiczny
)
```

## Integracja z innymi serwisami

### FileCabinetService
- **`restoreFileCabinetMembership()`** - przywraca uprawnienia do szafy plików dla nowego członka
- Zapewnia dostęp do galerii obrazów i dokumentów rodzinnych

### TaskService  
- **`restoreTaskListsMembership()`** - przywraca uprawnienia do list zadań
- Umożliwia uczestnictwo w zarządzaniu zadaniami rodzinnymi

### ChatService
- **`createIndividualChatsWithAllFamilyMembersForMember()`** - tworzy czaty indywidualne
- Zapewnia możliwość prywatnej komunikacji z każdym członkiem rodziny

## Przepływ operacji

### Dodawanie nowego członka (przez opiekuna)
1. Opiekun wywołuje `addMemberToFamilyGroup()`
2. Serwis dodaje członka do grupy w backendzie
3. Automatycznie przywraca uprawnienia we wszystkich zasobach
4. Nowy członek otrzymuje dostęp do czatów, plików i zadań

### Po dołączeniu do grupy (dla nowego członka)
1. Nowy członek wywołuje `afterJoinedToFamilyMembersOperations()`
2. Tworzone są czaty indywidualne z każdym członkiem rodziny
3. Użytkownik ma pełny dostęp do funkcji komunikacyjnych

## Obsługa błędów

Serwis może zgłaszać następujące wyjątki:

- `MemberAlreadyExistsException` - użytkownik już jest członkiem grupy
- `InsufficientPermissionsException` - brak uprawnień do dodawania członków
- `NetworkException` - problemy z połączeniem z backendem
- `InvalidMemberDataException` - nieprawidłowe dane nowego członka
- `SessionNotActiveException` - sesja grupy rodzinnej nie jest aktywna

## Przykłady użycia

### Dodawanie nowego członka przez opiekuna
```kotlin
try {
    val newMember = NewFamilyMemberData(
        id = "user_123",
        keyPair = KeyPairData(publicKey = "public_key_data")
    )
    
    familyMemberAdditionService.addMemberToFamilyGroup(
        contextId = currentContextId,
        newFamilyMember = newMember
    )
    
    // Członek został dodany i ma uprawnienia we wszystkich systemach
} catch (e: InsufficientPermissionsException) {
    // Użytkownik nie ma uprawnień do dodawania członków
} catch (e: MemberAlreadyExistsException) {
    // Użytkownik już jest członkiem grupy
}
```

### Operacje po dołączeniu do grupy
```kotlin
try {
    // Po pomyślnym dołączeniu do grupy rodzinnej
    familyMemberAdditionService.afterJoinedToFamilyMembersOperations()
    
    // Czaty indywidualne zostały utworzone
    // Użytkownik może komunikować się z wszystkimi członkami
} catch (e: SessionNotActiveException) {
    // Sesja nie jest aktywna - wymagane ponowne logowanie
}
```

### Sprawdzanie statusu operacji
```kotlin
// Przed dodaniem członka - sprawdzenie uprawnień
val currentUser = familyGroupSessionService.getCurrentUser()
if (currentUser.role == MemberRole.Guardian) {
    // Można dodawać nowych członków
    familyMemberAdditionService.addMemberToFamilyGroup(contextId, newMember)
} else {
    // Brak uprawnień - tylko opiekunowie mogą dodawać członków
}
```

## Uwagi implementacyjne

- Wszystkie operacje są asynchroniczne i mogą wymagać czasu na propagację uprawnień
- Serwis automatycznie synchronizuje uprawnienia we wszystkich podsystemach
- Obsługuje zarówno perspektywę dodającego (opiekun) jak i dołączającego (nowy członek)
- Zapewnia spójność uprawnień między różnymi komponentami systemu
- Nie obsługuje bezpośrednio walidacji uprawnień - zakłada, że użytkownik ma odpowiednie uprawnienia do wykonania operacji
- Operacje są wykonywane transakcyjnie - jeśli jedna część się nie powiedzie, całość zostaje wycofana
- Automatycznie aktualizuje lokalne cache po dodaniu nowego członka
