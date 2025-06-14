---
sidebar_position: 9
---

# TaskService

## Opis ogólny

`TaskService` jest serwisem odpowiedzialnym za zarządzanie zadaniami i listami zadań w aplikacji FamilyVault. Obsługuje tworzenie, aktualizowanie i usuwanie list zadań oraz zarządzanie poszczególnymi zadaniami w obrębie tych list. Wykorzystuje system wątków (threads) PrivMX do przechowywania i synchronizacji danych.

## Zależności

Serwis korzysta z następujących komponentów:
- `IFamilyGroupService` - zarządzanie grupą rodzinną
- `IFamilyGroupSessionService` - zarządzanie sesją grupy rodzinnej
- `IPrivMxClient` - komunikacja z PrivMX i operacje kryptograficzne

## Metody publiczne

### Zarządzanie listami zadań

#### `createNewTaskList`
```kotlin
suspend fun createNewTaskList(name: String)
```

**Opis:** Tworzy nową listę zadań w grupie rodzinnej.

**Parametry:**
- `name` - nazwa nowej listy zadań

**Proces:**
1. Pobiera identyfikator kontekstu z sesji
2. Dzieli członków rodziny na użytkowników i opiekunów
3. Tworzy wątek z tagiem `TASK_THREAD_TAG` i typem `LIST`
4. Ustawia opiekunów jako menedżerów wątku

#### `updateTaskList`
```kotlin
suspend fun updateTaskList(taskListId: String, name: String): Boolean
```

**Opis:** Aktualizuje nazwę istniejącej listy zadań.

**Parametry:**
- `taskListId` - identyfikator listy zadań
- `name` - nowa nazwa listy

**Zwraca:** `true` jeśli operacja zakończyła się sukcesem, `false` w przypadku błędu

**Proces:**
1. Dzieli członków rodziny na użytkowników i opiekunów
2. Aktualizuje wątek z nowymi danymi
3. Obsługuje wyjątki i zwraca status operacji

#### `deleteTaskList`
```kotlin
suspend fun deleteTaskList(taskListId: String)
```

**Opis:** Usuwa listę zadań i wszystkie zawarte w niej zadania.

**Parametry:**
- `taskListId` - identyfikator listy zadań do usunięcia

#### `getTaskLists`
```kotlin
suspend fun getTaskLists(): List<TaskList>
```

**Opis:** Pobiera wszystkie listy zadań w grupie rodzinnej.

**Zwraca:** Lista obiektów `TaskList`

**Proces:**
1. Pobiera kontekst z sesji
2. Pobiera wszystkie wątki z tagiem `TASK_THREAD_TAG`
3. Mapuje wątki na obiekty `TaskList` używając `ThreadItemToTaskListMapper`

### Zarządzanie zadaniami

#### `createNewTask` (z parametrami)
```kotlin
suspend fun createNewTask(
    taskListId: String,
    title: String,
    description: String,
    assignedMemberPubKey: String?
)
```

**Opis:** Tworzy nowe zadanie z podanymi parametrami.

**Parametry:**
- `taskListId` - identyfikator listy zadań
- `title` - tytuł zadania
- `description` - opis zadania
- `assignedMemberPubKey` - klucz publiczny przypisanego członka (opcjonalny)

**Proces:**
1. Tworzy obiekt `TaskContent` z podanych parametrów
2. Wywołuje przeciążoną metodę `createNewTask`

#### `createNewTask` (z obiektem TaskContent)
```kotlin
suspend fun createNewTask(taskListId: String, content: TaskContent)
```

**Opis:** Tworzy nowe zadanie na podstawie obiektu `TaskContent`.

**Parametry:**
- `taskListId` - identyfikator listy zadań
- `content` - obiekt zawierający dane zadania

**Proces:**
1. Serializuje `TaskContent` do JSON
2. Wysyła wiadomość do wątku z typem `TASK`

#### `updateTask` (z parametrami)
```kotlin
suspend fun updateTask(
    taskId: String,
    title: String?,
    description: String?,
    assignedMemberPubKey: String?
)
```

**Opis:** Aktualizuje istniejące zadanie z podanymi parametrami.

**Parametry:**
- `taskId` - identyfikator zadania
- `title` - nowy tytuł (opcjonalny)
- `description` - nowy opis (opcjonalny)
- `assignedMemberPubKey` - nowy przypisany członek (opcjonalny)

**Proces:**
1. Pobiera aktualne dane zadania
2. Deserializuje `TaskContent` z JSON
3. Tworzy zmodyfikowany obiekt z nowymi wartościami (zachowuje stare jeśli nowe nie podano)
4. Wywołuje przeciążoną metodę `updateTask`

#### `updateTask` (z obiektem TaskContent)
```kotlin
suspend fun updateTask(taskId: String, content: TaskContent)
```

**Opis:** Aktualizuje zadanie na podstawie obiektu `TaskContent`.

**Parametry:**
- `taskId` - identyfikator zadania
- `content` - nowa zawartość zadania

**Proces:**
1. Serializuje `TaskContent` do JSON
2. Aktualizuje zawartość wiadomości w PrivMX

#### `getTasksFromList`
```kotlin
suspend fun getTasksFromList(taskListId: String): List<Task>
```

**Opis:** Pobiera wszystkie zadania z określonej listy zadań.

**Parametry:**
- `taskListId` - identyfikator listy zadań

**Zwraca:** Lista obiektów `Task`

**Proces:**
1. Pobiera wiadomości z wątku (paginacja: 100 elementów od pozycji 0)
2. Mapuje wiadomości na obiekty `Task` używając `ThreadMessageItemToTask`

**Uwaga:** TODO w kodzie wskazuje na planowaną implementację paginacji zadań

### Zarządzanie uprawnieniami

#### `restoreTaskListsMembership`
```kotlin
suspend fun restoreTaskListsMembership()
```

**Opis:** Przywraca uprawnienia do wszystkich list zadań dla aktualnych członków grupy.

**Proces:**
1. Pobiera wszystkie listy zadań
2. Dzieli aktualnych członków rodziny na użytkowników i opiekunów
3. Aktualizuje każdą listę zadań z nowymi uprawnieniami

**Zastosowanie:** Wywoływana po dodaniu nowego członka do grupy rodzinnej

## Konfiguracja

- **`AppConfig.TASK_THREAD_TAG`** - tag używany do identyfikacji wątków zadań
- **Paginacja:** 100 elementów na stronę (dla list zadań i zadań)
- **Typ wątku:** `TaskThreadType.LIST` dla list zadań
- **Typ wiadomości:** `TaskMessageContentType.TASK` dla zadań

## Model danych

### TaskContent
```kotlin
data class TaskContent(
    val title: String,              // Tytuł zadania
    val description: String,        // Opis zadania  
    val completed: Boolean,         // Status ukończenia
    val assignedMemberPubKey: String?  // Klucz publiczny przypisanego członka
)
```

### TaskList
Obiekt reprezentujący listę zadań (tworzony przez mapper z ThreadItem).

### Task
Obiekt reprezentujący pojedyncze zadanie (tworzony przez mapper z ThreadMessageItem).

## Mapowanie danych

- **`ThreadItemToTaskListMapper`** - konwertuje wątki PrivMX na obiekty `TaskList`
- **`ThreadMessageItemToTask`** - konwertuje wiadomości PrivMX na obiekty `Task`

## Uwagi implementacyjne

- Zadania są przechowywane jako wiadomości w wątkach PrivMX
- Listy zadań są reprezentowane jako wątki z odpowiednim tagiem i typem
- Serializacja/deserializacja danych odbywa się przez JSON
- Opiekunowie grupy automatycznie otrzymują uprawnienia menedżera list zadań
- Wszyscy członkowie mają dostęp do zadań, ale tylko menedżerowie mogą modyfikować strukturę
- Implementacja obsługuje częściowe aktualizacje zadań (tylko zmienione pola)

## Bezpieczeństwo

- Uprawnienia są zarządzane na poziomie wątków PrivMX
- Automatyczna synchronizacja uprawnień z rolami w grupie rodzinnej
- Szyfrowanie end-to-end dla wszystkich danych zadań
- Operacje wymagają aktywnej sesji grupy rodzinnej
