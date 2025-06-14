---
sidebar_position: 12
---

# DocumentPickerService

## Opis ogólny

`DocumentPickerService` jest serwisem odpowiedzialnym za zarządzanie procesem wybierania dokumentów w aplikacji FamilyVault. Umożliwia otwieranie systemowego selektora dokumentów, pobieranie wybranych plików oraz generowanie podglądów PDF. 

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `ActivityResultContracts.OpenMultipleDocuments` - systemowy selektor dokumentów
- `ContentResolver` - dostęp do metadanych plików
- `PdfRenderer` - generowanie podglądów stron PDF
- `CoroutineScope` - zarządzanie asynchronicznymi operacjami

## Właściwości prywatne

- `continuation: Continuation<List<ByteArray>>?` - kontynuacja dla asynchronicznych operacji
- `pickDocumentLauncher: ActivityResultLauncher<Array<String>>` - launcher dla selektora dokumentów
- `context: Context` - kontekst aplikacji
- `selectedDocumentUrls: MutableStateList<String>` - lista URI wybranych dokumentów
- `isInitialized: Boolean` - flaga inicjalizacji serwisu

## Konfiguracja

### Obsługiwane typy MIME
- `"application/pdf"` - dokumenty PDF
- `"image/jpeg"` - obrazy JPEG
- `"image/png"` - obrazy PNG

## Metody publiczne

### Inicjalizacja

#### `initializeWithActivity`
```kotlin
fun initializeWithActivity(activity: ComponentActivity)
```

**Opis:** Inicjalizuje serwis z podaną aktywnością Android.

**Parametry:**
- `activity` - instancja ComponentActivity

**Proces:**
1. Przypisuje kontekst z aktywności
2. Rejestruje launcher dla selektora dokumentów
3. Konfiguruje callback do obsługi wybranych plików
4. Ustawia flagę inicjalizacji

**Uwaga:** Musi być wywołana przed użyciem innych metod

### Wybieranie dokumentów

#### `openDocumentPicker`
```kotlin
fun openDocumentPicker()
```

**Opis:** Otwiera systemowy selektor dokumentów z obsługiwanymi typami MIME.

**Wyjątki:** `IllegalStateException` jeśli serwis nie został zainicjalizowany

#### `pickDocumentsAndReturnByteArrays`
```kotlin
suspend fun pickDocumentsAndReturnByteArrays(): List<ByteArray>
```

**Opis:** Asynchronicznie otwiera selektor i zwraca wybrane dokumenty jako ByteArray.

**Zwraca:** Lista dokumentów w formacie ByteArray

**Proces:**
1. Ustawia kontynuację coroutine
2. Otwiera selektor dokumentów
3. Czeka na wybór użytkownika
4. Zwraca przekonwertowane dane

### Zarządzanie danymi

#### `getBytesFromUri`
```kotlin
fun getBytesFromUri(uriString: String): ByteArray?
```

**Opis:** Konwertuje URI dokumentu na dane ByteArray.

**Parametry:**
- `uriString` - URI dokumentu w formie String

**Zwraca:** Dane dokumentu jako ByteArray lub null w przypadku błędu

#### `getSelectedDocumentAsByteArrays`
```kotlin
fun getSelectedDocumentAsByteArrays(): List<ByteArray>
```

**Opis:** Konwertuje wszystkie wybrane dokumenty na tablice bajtów.

**Zwraca:** Lista ByteArray reprezentujących wybrane dokumenty

#### `getSelectedDocumentUrls`
```kotlin
fun getSelectedDocumentUrls(): List<String>
```

**Opis:** Pobiera listę URI wybranych dokumentów.

**Zwraca:** Lista URI w formie String

### Metadane dokumentów

#### `getDocumentNameFromUri`
```kotlin
fun getDocumentNameFromUri(uriString: String): String?
```

**Opis:** Pobiera nazwę dokumentu na podstawie URI.

**Parametry:**
- `uriString` - URI dokumentu

**Zwraca:** Nazwa dokumentu lub null jeśli nie można pobrać

**Proces:**
1. Używa ContentResolver do wykonania query
2. Pobiera wartość z kolumny `OpenableColumns.DISPLAY_NAME`
3. Zwraca nazwę lub null

#### `getDocumentMimeTypeFromUri`
```kotlin
fun getDocumentMimeTypeFromUri(uriString: String): String?
```

**Opis:** Pobiera typ MIME dokumentu na podstawie URI.

**Parametry:**
- `uriString` - URI dokumentu

**Zwraca:** Typ MIME lub null jeśli nie można określić

### Generowanie podglądów

#### `getDocumentPreviewPageFromUri`
```kotlin
fun getDocumentPreviewPageFromUri(uriString: String): ByteArray
```

**Opis:** Generuje podgląd pierwszej strony dokumentu PDF jako obraz JPEG.

**Parametry:**
- `uriString` - URI dokumentu PDF

**Zwraca:** Podgląd pierwszej strony jako ByteArray (JPEG)

**Proces:**
1. Otwiera FileDescriptor dla URI
2. Tworzy PdfRenderer
3. Renderuje pierwszą stronę do Bitmap
4. Kompresuje Bitmap do JPEG (95% jakości)
5. Zwraca jako ByteArray

**Uwagi:** Metoda obsługuje tylko pliki PDF

### Zarządzanie stanem

#### `clearSelectedDocuments`
```kotlin
fun clearSelectedDocuments()
```

**Opis:** Czyści listę wybranych dokumentów.

#### `removeSelectedDocument`
```kotlin
fun removeSelectedDocument(uri: String)
```

**Opis:** Usuwa konkretny dokument z listy wybranych.

**Parametry:**
- `uri` - URI dokumentu do usunięcia

## Stałe

- **`TAG = "DocumentPickerService"`** - tag do logowania
- **Kompresja JPEG:** 95% jakości dla podglądów PDF

## Obsługa błędów

- Wszystkie metody używają try-catch i zwracają null/pustą listę w przypadku błędów
- Szczegółowe logowanie błędów z tagiem "DocumentPickerService"
- Graceful handling braku inicjalizacji serwisu

## Integracja z aplikacją

Serwis jest używany głównie do:
- Wybierania dokumentów do przesłania do szafy plików
- Generowania podglądów PDF przed przesłaniem
- Pobierania metadanych wybranych plików

## Ograniczenia platformowe

- **Android Only:** Wykorzystuje natywne API Android
- **Uprawnienia:** Wymaga dostępu do pamięci urządzenia
- **Typy plików:** Ograniczone do PDF, JPEG i PNG
- **Minimalna wersja:** Wymaga API level obsługującego `PdfRenderer`

## Uwagi implementacyjne

- Selektor obsługuje wielokrotny wybór dokumentów
- Automatyczne czyszczenie listy po pobraniu danych
- Thread-safe dzięki użyciu coroutines
- Lazy initialization - wymaga wywołania `initializeWithActivity`
- Logowanie wszystkich operacji dla debugowania
