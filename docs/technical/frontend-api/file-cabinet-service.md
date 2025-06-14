---
sidebar_position: 6
---

# FileCabinetService


`FileCabinetService` jest serwisem odpowiedzialnym za zarządzanie szafą plików (File Cabinet) w aplikacji FamilyVault. Obsługuje dwa główne typy przechowywania plików: galerię obrazów oraz dokumenty. Umożliwia tworzenie, przesyłanie, pobieranie plików oraz zarządzanie uprawnieniami dostępu do zasobów szafy plików.

## Zależności

Serwis korzysta z następujących komponentów:
- `IPrivMxClient` - komunikacja z PrivMX i operacje kryptograficzne
- `IImagePickerService` - przetwarzanie obrazów
- `IFamilyGroupSessionService` - zarządzanie sesją grupy rodzinnej
- `IFamilyGroupService` - zarządzanie grupą rodzinną

## Metody publiczne

### Inicjalizacja

#### `createInitialStores`
```kotlin
suspend fun createInitialStores()
```

**Opis:** Tworzy początkowe store'y dla szafy plików (galeria i dokumenty).

**Proces:**
1. Pobiera identyfikator kontekstu z sesji
2. Dzieli członków rodziny na użytkowników i menedżerów
3. Tworzy store dla galerii obrazów
4. Tworzy store dla dokumentów

### Galeria obrazów

#### `sendImageToFileCabinetGallery`
```kotlin
fun sendImageToFileCabinetGallery(image: ByteArray)
```

**Opis:** Wysyła obraz do galerii szafy plików.

**Parametry:**
- `image` - dane obrazu w formacie ByteArray

**Proces:**
1. Pobiera store galerii
2. Kompresuje i obraca obraz
3. Wysyła przetworzone dane do store'a

#### `getImagesFromFileCabinetGallery`
```kotlin
fun getImagesFromFileCabinetGallery(): List<ByteArray>
```

**Opis:** Pobiera wszystkie obrazy z galerii szafy plików.

**Zwraca:** Lista obrazów w formacie ByteArray

**Parametry paginacji:** maksymalnie 100 plików, od pozycji 0

### Dokumenty

#### `sendDocumentToFileCabinetDocuments`
```kotlin
suspend fun sendDocumentToFileCabinetDocuments(
    content: ByteArray,
    name: String,
    mimeType: String,
    contentPreview: ByteArray?
)
```

**Opis:** Wysyła dokument do sekcji dokumentów szafy plików.

**Parametry:**
- `content` - zawartość dokumentu w ByteArray
- `name` - nazwa dokumentu
- `mimeType` - typ MIME dokumentu
- `contentPreview` - podgląd dokumentu (opcjonalny)

**Proces:**
1. Pobiera store dokumentów
2. Tworzy obiekt `FileCabinetDocument`
3. Serializuje dokument do JSON
4. Wysyła zaszyfrowane dane do store'a

#### `getDocumentsFromFileCabinetDocuments`
```kotlin
fun getDocumentsFromFileCabinetDocuments(): List<FileCabinetDocument>
```

**Opis:** Pobiera wszystkie dokumenty z szafy plików.

**Zwraca:** Lista objektów `FileCabinetDocument`

**Proces:**
1. Pobiera store dokumentów
2. Pobiera surowe dane z store'a
3. Mapuje ByteArray na obiekty `FileCabinetDocument`

### Zarządzanie uprawnieniami

#### `restoreFileCabinetMembership`
```kotlin
suspend fun restoreFileCabinetMembership()
```

**Opis:** Przywraca uprawnienia członków do obu store'ów szafy plików.

**Proces:**
1. Pobiera identyfikatory store'ów galerii i dokumentów
2. Dzieli aktualnych członków rodziny na użytkowników i menedżerów
3. Aktualizuje uprawnienia dla store'a galerii
4. Aktualizuje uprawnienia dla store'a dokumentów

**Zastosowanie:** Wywoływana po dodaniu nowego członka do grupy rodzinnej

### Gettery identyfikatorów

#### `getGalleryStoreId`
```kotlin
fun getGalleryStoreId(): String
```

**Opis:** Pobiera identyfikator store'a galerii obrazów.

**Zwraca:** Identyfikator store'a galerii

#### `getDocumentsStoreId`
```kotlin
fun getDocumentsStoreId(): String
```

**Opis:** Pobiera identyfikator store'a dokumentów.

**Zwraca:** Identyfikator store'a dokumentów

## Metody prywatne

### `createFileCabinetGalleryStore`
Tworzy store dla galerii obrazów z typem `FILE_CABINET_IMAGES`.

### `createFileCabinetDocumentsStore`
Tworzy store dla dokumentów z typem `FILE_CABINET_DOCUMENTS`.

### `retrieveFileCabinetGalleryStore`
Pobiera store galerii na podstawie typu `FILE_CABINET_IMAGES`.

### `retrieveFileCabinetDocumentsStore`
Pobiera store dokumentów na podstawie typu `FILE_CABINET_DOCUMENTS`.

## Typy store'ów

- **`FILE_CABINET_IMAGES`** - przechowywanie obrazów galerii
- **`FILE_CABINET_DOCUMENTS`** - przechowywanie dokumentów

## Model danych

### FileCabinetDocument
```kotlin
data class FileCabinetDocument(
    val name: String,           // Nazwa dokumentu
    val mimeType: String,       // Typ MIME
    val content: ByteArray,     // Zawartość dokumentu
    val contentPreview: ByteArray? // Podgląd (opcjonalny)
)
```

## Uwagi implementacyjne

- Automatycznie kompresuje i obraca obrazy przed zapisem
- Dokumenty są serializowane do JSON przed przesłaniem
- Używa paginacji (100 elementów na stronę) dla pobierania plików
- Automatycznie zarządza uprawnieniami na podstawie ról w grupie rodzinnej
- Store'y są tworzone z odpowiednimi uprawnieniami dla użytkowników i menedżerów
- Wszystkie pliki są szyfrowane end-to-end przez PrivMX
