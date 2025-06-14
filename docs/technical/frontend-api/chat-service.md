---
sidebar_position: 1
---

# ChatService

## Opis ogólny

`ChatService` jest głównym serwisem odpowiedzialnym za zarządzanie komunikacją w aplikacji FamilyVault. Obsługuje tworzenie i zarządzanie czatami grupowymi oraz indywidualnymi, wysyłanie różnych typów wiadomości (tekst, głos, obraz), oraz synchronizację wiadomości z bazą danych lokalnej.

## Zależności

Serwis korzysta z następujących komponentów:
- `IFamilyGroupService` - zarządzanie grupami rodzinnymi
- `IFamilyGroupSessionService` - obsługa sesji grup rodzinnych
- `IPrivMxClient` - komunikacja z PrivMX i operacje kryptograficzne
- `IStoredChatMessageRepository` - lokalne przechowywanie wiadomości
- `IImagePickerService` - przetwarzanie obrazów

## Metody publiczne

### Zarządzanie czatami grupowymi

#### `createGroupChat`
```kotlin
suspend fun createGroupChat(
    name: String,
    members: List<FamilyMember>,
    chatIcon: ThreadIconType
): ChatThread
```

**Opis:** Tworzy nowy czat grupowy z określonymi członkami.

**Parametry:**
- `name` - nazwa czatu grupowego
- `members` - lista członków czatu
- `chatIcon` - ikona czatu

**Zwraca:** Obiekt `ChatThread` reprezentujący utworzony czat

**Proces:**
1. Dzieli członków na użytkowników i menedżerów
2. Tworzy store dla plików czatu
3. Tworzy wątek czatu z odpowiednimi uprawnieniami

#### `updateChatThread`
```kotlin
suspend fun updateChatThread(
    thread: ChatThread,
    members: List<FamilyMember>,
    newName: String?,
    chatIcon: ThreadIconType?,
    chatCreator: FamilyMember?
)
```

**Opis:** Aktualizuje istniejący wątek czatu (członkowie, nazwa, ikona).

**Parametry:**
- `thread` - czat do zaktualizowania
- `members` - nowa lista członków
- `newName` - nowa nazwa czatu (opcjonalna)
- `chatIcon` - nowa ikona czatu (opcjonalna)
- `chatCreator` - twórca czatu (opcjonalny)

#### `retrieveAllGroupChatThreads`
```kotlin
fun retrieveAllGroupChatThreads(): List<ChatThread>
```

**Opis:** Pobiera wszystkie czaty grupowe użytkownika.

**Zwraca:** Lista czatów grupowych

### Zarządzanie czatami indywidualnymi

#### `createIndividualChat`
```kotlin
suspend fun createIndividualChat(
    firstMember: FamilyMember,
    secondMember: FamilyMember
)
```

**Opis:** Tworzy czat indywidualny między dwoma członkami rodziny.

**Parametry:**
- `firstMember` - pierwszy członek czatu
- `secondMember` - drugi członek czatu

#### `createIndividualChatsWithAllFamilyMembersForMember`
```kotlin
suspend fun createIndividualChatsWithAllFamilyMembersForMember(member: FamilyMember)
```

**Opis:** Tworzy czaty indywidualne między określonym członkiem a wszystkimi innymi członkami rodziny.

**Parametry:**
- `member` - członek, dla którego tworzone są czaty

#### `retrieveAllIndividualChatThreads`
```kotlin
fun retrieveAllIndividualChatThreads(): List<ChatThread>
```

**Opis:** Pobiera wszystkie czaty indywidualne użytkownika.

**Zwraca:** Lista czatów indywidualnych

### Wysyłanie wiadomości

#### `sendTextMessage`
```kotlin
fun sendTextMessage(
    chatThreadId: String,
    messageContent: String,
    respondToMessageId: String
)
```

**Opis:** Wysyła wiadomość tekstową do określonego czatu.

**Parametry:**
- `chatThreadId` - identyfikator czatu
- `messageContent` - treść wiadomości
- `respondToMessageId` - ID wiadomości, na którą odpowiadamy

#### `sendVoiceMessage`
```kotlin
fun sendVoiceMessage(
    chatThreadId: String,
    audioData: ByteArray
)
```

**Opis:** Wysyła wiadomość głosową do czatu.

**Parametry:**
- `chatThreadId` - identyfikator czatu
- `audioData` - dane audio w formacie ByteArray

**Proces:**
1. Pobiera ID store'a dla plików czatu
2. Zapisuje plik audio w store
3. Wysyła wiadomość z referencją do pliku

#### `sendImageMessage`
```kotlin
fun sendImageMessage(
    chatThreadId: String,
    imageByteArray: ByteArray
)
```

**Opis:** Wysyła wiadomość z obrazem do czatu.

**Parametry:**
- `chatThreadId` - identyfikator czatu
- `imageByteArray` - dane obrazu w formacie ByteArray

**Proces:**
1. Kompresuje i obraca obraz
2. Zapisuje obraz w store
3. Tworzy metadane obrazu (wymiary, ID pliku)
4. Wysyła wiadomość z metadanymi obrazu

### Pobieranie wiadomości

#### `retrieveMessagesFirstPage`
```kotlin
suspend fun retrieveMessagesFirstPage(chatThreadId: String): List<ChatMessage>
```

**Opis:** Pobiera pierwszą stronę wiadomości z określonego czatu.

**Parametry:**
- `chatThreadId` - identyfikator czatu

**Zwraca:** Lista wiadomości z pierwszej strony

#### `retrieveMessagesPage`
```kotlin
suspend fun retrieveMessagesPage(chatThreadId: String, page: Int): List<ChatMessage>
```

**Opis:** Pobiera określoną stronę wiadomości z czatu.

**Parametry:**
- `chatThreadId` - identyfikator czatu
- `page` - numer strony (0-indexed)

**Zwraca:** Lista wiadomości z określonej strony

#### `getVoiceMessage`
```kotlin
fun getVoiceMessage(fileId: String): ByteArray
```

**Opis:** Pobiera dane wiadomości głosowej na podstawie ID pliku.

**Parametry:**
- `fileId` - identyfikator pliku audio

**Zwraca:** Dane audio w formacie ByteArray

#### `getImageMessage`
```kotlin
fun getImageMessage(fileId: String): ByteArray
```

**Opis:** Pobiera dane obrazu na podstawie ID pliku.

**Parametry:**
- `fileId` - identyfikator pliku obrazu

**Zwraca:** Dane obrazu w formacie ByteArray

#### `getImageBitmap`
```kotlin
fun getImageBitmap(chatMessage: String): ImageBitmap?
```

**Opis:** Konwertuje dane wiadomości na obiekt ImageBitmap do wyświetlenia.

**Parametry:**
- `chatMessage` - ID pliku obrazu

**Zwraca:** Obiekt ImageBitmap lub null w przypadku błędu

### Zarządzanie czatami

#### `retrieveAllChatThreads`
```kotlin
fun retrieveAllChatThreads(): List<ChatThread>
```

**Opis:** Pobiera wszystkie czaty użytkownika (grupowe i indywidualne).

**Zwraca:** Lista wszystkich czatów

#### `retrieveLastMessage`
```kotlin
fun retrieveLastMessage(chatThreadId: String): ChatMessage?
```

**Opis:** Pobiera ostatnią wiadomość z określonego czatu.

**Parametry:**
- `chatThreadId` - identyfikator czatu

**Zwraca:** Ostatnia wiadomość lub null jeśli czat jest pusty

### Synchronizacja i zarządzanie danymi

#### `populateDatabaseWithLastMessages`
```kotlin
suspend fun populateDatabaseWithLastMessages(chatThreadId: String)
```

**Opis:** Synchronizuje wiadomości z serwera do lokalnej bazy danych.

**Parametry:**
- `chatThreadId` - identyfikator czatu do synchronizacji

**Proces:**
1. Pobiera wiadomości strona po stronie
2. Sprawdza czy wiadomość już istnieje lokalnie
3. Dodaje nowe wiadomości do bazy danych
4. Kończy gdy napotka istniejącą wiadomość

#### `updateGroupChatThreadsAfterUserPermissionChange`
```kotlin
suspend fun updateGroupChatThreadsAfterUserPermissionChange(
    updatedUser: FamilyMember,
    familyMembers: List<FamilyMember>
)
```

**Opis:** Aktualizuje czaty grupowe po zmianie uprawnień użytkownika.

**Parametry:**
- `updatedUser` - użytkownik o zmienionych uprawnieniach
- `familyMembers` - lista wszystkich członków rodziny

### Zarządzanie uprawnieniami

#### `retrievePublicKeysOfChatThreadManagers`
```kotlin
suspend fun retrievePublicKeysOfChatThreadManagers(threadId: String): List<String>
```

**Opis:** Pobiera klucze publiczne menedżerów określonego czatu.

**Parametry:**
- `threadId` - identyfikator wątku czatu

**Zwraca:** Lista kluczy publicznych menedżerów

#### `retrieveChatThreadInitialManagers`
```kotlin
suspend fun retrieveChatThreadInitialManagers(threadId: String): List<String>
```

**Opis:** Pobiera klucze publiczne początkowych menedżerów czatu.

**Parametry:**
- `threadId` - identyfikator wątku czatu

**Zwraca:** Lista kluczy publicznych początkowych menedżerów

## Typy danych

### ChatMessageContentType
```kotlin
enum class ChatMessageContentType {
    TEXT,    // Wiadomość tekstowa
    VOICE,   // Wiadomość głosowa
    IMAGE    // Wiadomość ze zdjęciem
}
```

### ChatThreadType
```kotlin
enum class ChatThreadType {
    GROUP,       // Czat grupowy
    INDIVIDUAL   // Czat indywidualny
}
```

### ThreadIconType
Dostępne ikony wątków czatu reprezentowane jako enum z różnymi opcjami graficznymi.

### ChatThread
```kotlin
data class ChatThread(
    val id: String,                      // Unikalny identyfikator
    val name: String,                    // Nazwa wątku
    val participantsIds: List<String>,   // Lista ID uczestników
    val lastMessage: ChatMessage?,       // Ostatnia wiadomość
    val type: ChatThreadType,            // Typ wątku
    val referenceStoreId: String?,       // ID referencyjnego store'a
    val iconType: ThreadIconType         // Typ ikony
)
```

### ChatMessage
```kotlin
data class ChatMessage(
    val id: String,                          // Unikalny identyfikator
    val threadId: String,                    // ID wątku czatu
    val content: String,                     // Treść wiadomości
    val contentType: ChatMessageContentType, // Typ zawartości
    val authorPublicKey: String,             // Klucz publiczny autora
    val timestamp: LocalDateTime,            // Data i czas wysłania
    val respondToMessageId: String?          // ID wiadomości, na którą odpowiada
)
```

## Obsługa błędów

Serwis może zgłaszać następujące wyjątki:

- `ChatThreadNotFoundException` - wątek czatu nie został znaleziony
- `InsufficientPermissionsException` - brak uprawnień do operacji
- `MessageNotFoundException` - wiadomość nie została znaleziona
- `FileNotFoundException` - plik multimedialny nie został znaleziony
- `NetworkException` - problemy z połączeniem sieciowym
- `CryptographyException` - błędy szyfrowania/deszyfrowania
- `ImageProcessingException` - błędy przetwarzania obrazów

## Przykłady użycia

### Tworzenie czatu grupowego
```kotlin
try {
    val chatThread = chatService.createGroupChat(
        name = "Rodzinny czat",
        members = familyMembers,
        chatIcon = ThreadIconType.FAMILY
    )
    // Czat został utworzony pomyślnie
} catch (e: Exception) {
    // Obsłuż błąd tworzenia czatu
}
```

### Wysyłanie wiadomości tekstowej
```kotlin
chatService.sendTextMessage(
    chatThreadId = "thread_123",
    messageContent = "Cześć wszystkim!",
    respondToMessageId = "" // Brak odpowiedzi na konkretną wiadomość
)
```

### Pobieranie wiadomości z paginacją
```kotlin
// Pierwsza strona wiadomości
val firstPage = chatService.retrieveMessagesFirstPage("thread_123")

// Kolejne strony
val secondPage = chatService.retrieveMessagesPage("thread_123", 1)
val thirdPage = chatService.retrieveMessagesPage("thread_123", 2)
```

### Wysyłanie wiadomości głosowej
```kotlin
val audioData = recordAudio() // Implementacja nagrywania
chatService.sendVoiceMessage(
    chatThreadId = "thread_123",
    audioData = audioData
)
```

### Pobieranie obrazu z wiadomości
```kotlin
val imageData = chatService.getImageMessage("file_456")
val bitmap = chatService.getImageBitmap("file_456")
```

## Uwagi implementacyjne

- Obsługuje trzy typy wiadomości: tekstowe, głosowe i obrazowe
- Automatycznie kompresuje i obraca obrazy przed wysłaniem
- Używa paginacji do efektywnego ładowania wiadomości
- Synchronizuje dane z lokalną bazą danych dla offline'owego dostępu
- Automatycznie zarządza uprawnieniami w czatach na podstawie ról w grupie rodzinnej
- Obsługuje zarówno czaty grupowe jak i indywidualne
- Używa szyfrowania end-to-end dla bezpieczeństwa komunikacji
- Wszystkie operacje asynchroniczne używają `suspend`
- Pliki multimedialne są przechowywane w dedykowanych store'ach
- Lokalna baza danych cache'uje wiadomości dla lepszej wydajności

## Bezpieczeństwo

- Wszystkie wiadomości są szyfrowane end-to-end
- Klucze szyfrowania są zarządzane automatycznie przez PrivMX
- Pliki multimedialne są szyfrowane przed zapisaniem
- Uprawnienia w czatach są synchronizowane z rolami w grupie rodzinnej
- Dane lokalne są zabezpieczone szyfrowaniem urządzenia
