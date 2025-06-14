---
sidebar_position: 1
---

# ChatService

ChatService jest głównym serwisem odpowiedzialnym za zarządzanie czatami, wątkami oraz wiadomościami w aplikacji FamilyVault.

## Zarządzanie wątkami czatu

### createGroupChat

**Parametry:**
- `name: String` - nazwa grupy czatu
- `members: List<FamilyMember>` - lista członków rodziny do dodania
- `chatIcon: ThreadIconType` - ikona czatu

**Zwraca:** `ChatThread` - utworzony wątek czatu

**Przykład użycia:**
```kotlin
val chatThread = chatService.createGroupChat(
    name = "Rodzinny czat",
    members = listOf(member1, member2),
    chatIcon = ThreadIconType.FAMILY
)
```

### createIndividualChat

**Parametry:**
- `firstMember: FamilyMember` - pierwszy uczestnik
- `secondMember: FamilyMember` - drugi uczestnik

**Zwraca:** `Unit`

### createIndividualChatsWithAllFamilyMembersForMember

**Parametry:**
- `member: FamilyMember` - członek rodziny

**Zwraca:** `Unit`

### updateChatThread

**Parametry:**
- `thread: ChatThread` - wątek do aktualizacji
- `members: List<FamilyMember>` - nowa lista członków
- `newName: String?` - nowa nazwa (opcjonalne)
- `chatIcon: ThreadIconType?` - nowa ikona (opcjonalne)
- `chatCreator: FamilyMember?` - twórca czatu (opcjonalne)

**Zwraca:** `Unit`

## Pobieranie wątków

### retrieveAllChatThreads

**Zwraca:** `List<ChatThread>`

### retrieveAllGroupChatThreads

**Zwraca:** `List<ChatThread>`

### retrieveAllIndividualChatThreads

**Zwraca:** `List<ChatThread>`

## Wysyłanie wiadomości

### sendTextMessage

**Parametry:**
- `chatThreadId: String` - ID wątku czatu
- `messageContent: String` - treść wiadomości
- `respondToMessageId: String` - ID wiadomości, na którą odpowiadamy

**Zwraca:** `Unit`

**Przykład użycia:**
```kotlin
chatService.sendTextMessage(
    chatThreadId = "thread123",
    messageContent = "Cześć wszystkim!",
    respondToMessageId = ""
)
```

### sendVoiceMessage

**Parametry:**
- `chatThreadId: String` - ID wątku czatu
- `audioData: ByteArray` - dane audio

**Zwraca:** `Unit`

### sendImageMessage

**Parametry:**
- `chatThreadId: String` - ID wątku czatu
- `imageByteArray: ByteArray` - dane obrazu

**Zwraca:** `Unit`

## Pobieranie wiadomości

### retrieveMessagesFirstPage

**Parametry:**
- `chatThreadId: String` - ID wątku czatu

**Zwraca:** `List<ChatMessage>`

### retrieveMessagesPage

**Parametry:**
- `chatThreadId: String` - ID wątku czatu
- `page: Int` - numer strony

**Zwraca:** `List<ChatMessage>`

### retrieveLastMessage

**Parametry:**
- `chatThreadId: String` - ID wątku czatu

**Zwraca:** `ChatMessage?` - ostatnia wiadomość lub null

## Pobieranie plików multimedialnych

### getVoiceMessage

**Parametry:**
- `fileId: String` - ID pliku

**Zwraca:** `ByteArray` - dane audio

### getImageMessage

**Parametry:**
- `fileId: String` - ID pliku

**Zwraca:** `ByteArray` - dane obrazu

### getImageBitmap

**Parametry:**
- `chatMessage: String` - ID wiadomości

**Zwraca:** `ImageBitmap?` - bitmap obrazu lub null

## Zarządzanie uprawnieniami

### retrievePublicKeysOfChatThreadManagers

**Parametry:**
- `threadId: String` - ID wątku

**Zwraca:** `List<String>` - lista kluczy publicznych

### retrieveChatThreadInitialManagers

**Parametry:**
- `threadId: String` - ID wątku

**Zwraca:** `List<String>` - lista kluczy publicznych

### updateGroupChatThreadsAfterUserPermissionChange

Aktualizuje grupowe wątki czatu po zmianie uprawnień użytkownika.

**Parametry:**
- `updatedUser: FamilyMember` - użytkownik ze zmienionymi uprawnieniami
- `familyMembers: List<FamilyMember>` - lista członków rodziny

**Zwraca:** `Unit`

## Zarządzanie bazą danych

### populateDatabaseWithLastMessages

Wypełnia lokalną bazę danych najnowszymi wiadomościami z serwera.

**Parametry:**
- `chatThreadId: String` - ID wątku czatu

**Zwraca:** `Unit`

## Typy wyliczeniowe

### ChatMessageContentType
- `TEXT` - wiadomość tekstowa
- `VOICE` - wiadomość głosowa
- `IMAGE` - wiadomość ze zdjęciem

### ChatThreadType
- `GROUP` - czat grupowy
- `INDIVIDUAL` - czat indywidualny

### ThreadIconType
Dostępne ikony wątków czatu (szczegóły w dokumentacji modeli).

## Modele danych

### ChatThread
Reprezentuje wątek czatu z następującymi właściwościami:
- `id: String` - unikalny identyfikator
- `name: String` - nazwa wątku
- `participantsIds: List<String>` - lista ID uczestników
- `lastMessage: ChatMessage?` - ostatnia wiadomość
- `type: ChatThreadType` - typ wątku
- `referenceStoreId: String?` - ID referencyjnego store'a
- `iconType: ThreadIconType` - typ ikony

### ChatMessage
Reprezentuje wiadomość w czacie z metadanymi takimi jak ID, treść, typ zawartości, data wysłania i informacje o nadawcy.

## Obsługa błędów

Wszystkie metody mogą rzucić wyjątki związane z:
- Problemami z połączeniem sieciowym
- Błędami autoryzacji
- Nieprawidłowymi parametrami
- Błędami szyfrowania/deszyfrowania

Zaleca się odpowiednie obsłużenie wyjątków w warstwie UI.
