---
sidebar_position: 14
---

# ImagePickerService

## Opis ogólny

`ImagePickerService` jest serwisem odpowiedzialnym za zarządzanie procesem wybierania, przetwarzania i zarządzania obrazami w aplikacji FamilyVault. Umożliwia otwieranie systemowego selektora obrazów, kompresję, rotację oraz konwersję obrazów do różnych formatów.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `ActivityResultContracts.PickMultipleVisualMedia` - systemowy selektor mediów
- `BitmapFactory` - dekodowanie obrazów
- `ExifInterface` - odczyt metadanych obrazów
- `Matrix` - transformacje graficzne
- `Bitmap` - manipulacja obrazami

## Właściwości prywatne

- `continuation: Continuation<List<ByteArray>>?` - kontynuacja dla asynchronicznych operacji
- `pickFileLauncher: ActivityResultLauncher<PickVisualMediaRequest>` - launcher dla selektora obrazów
- `context: Context` - kontekst aplikacji
- `selectedImageUrls: MutableStateList<String>` - lista URI wybranych obrazów

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
2. Rejestruje launcher dla selektora obrazów
3. Konfiguruje callback do obsługi wybranych plików
4. Automatycznie czyści listę i konwertuje obrazy na ByteArray

### Wybieranie obrazów

#### `openMediaPickerForSelectingImages`
```kotlin
fun openMediaPickerForSelectingImages()
```

**Opis:** Otwiera systemowy selektor obrazów z filtrem tylko dla obrazów.

**Konfiguracja:** Używa `ActivityResultContracts.PickVisualMedia.ImageOnly`

#### `pickImagesAndReturnByteArrays`
```kotlin
suspend fun pickImagesAndReturnByteArrays(): List<ByteArray>
```

**Opis:** Asynchronicznie otwiera selektor i zwraca wybrane obrazy jako ByteArray.

**Zwraca:** Lista obrazów w formacie ByteArray

**Proces:**
1. Ustawia kontynuację coroutine
2. Otwiera selektor obrazów
3. Czeka na wybór użytkownika
4. Zwraca przekonwertowane dane

### Konwersja danych

#### `getBytesFromUri`
```kotlin
fun getBytesFromUri(uriString: String): ByteArray?
```

**Opis:** Konwertuje URI obrazu na dane ByteArray.

**Parametry:**
- `uriString` - URI obrazu w formie String

**Zwraca:** Dane obrazu jako ByteArray lub null w przypadku błędu

#### `getSelectedImageAsByteArrays`
```kotlin
fun getSelectedImageAsByteArrays(): List<ByteArray>
```

**Opis:** Konwertuje wszystkie wybrane obrazy na tablice bajtów i czyści listę.

**Zwraca:** Lista ByteArray reprezentujących wybrane obrazy

**Proces:**
1. Mapuje URI na ByteArray używając `getBytesFromUri`
2. Automatycznie czyści listę wybranych obrazów
3. Zwraca tylko pomyślnie przekonwertowane obrazy

#### `getBitmapFromBytes`
```kotlin
fun getBitmapFromBytes(imageBytes: ByteArray): ImageBitmap
```

**Opis:** Konwertuje dane ByteArray na obiekt ImageBitmap z automatyczną rotacją.

**Parametry:**
- `imageBytes` - dane obrazu w ByteArray

**Zwraca:** Obiekt ImageBitmap gotowy do wyświetlenia

**Proces:**
1. Naprawia rotację obrazu używając `fixImageRotation`
2. Konwertuje na Compose ImageBitmap

### Przetwarzanie obrazów

#### `compressAndRotateImage`
```kotlin
fun compressAndRotateImage(
    imageByteArray: ByteArray,
    compressionQuality: Int?
): ByteArray
```

**Opis:** Kompresuje i obraca obraz w jednej operacji.

**Parametry:**
- `imageByteArray` - oryginalne dane obrazu
- `compressionQuality` - jakość kompresji (opcjonalna, domyślnie z AppConfig)

**Zwraca:** Przetworzone dane obrazu jako ByteArray

**Proces:**
1. Naprawia rotację używając `fixImageRotation`
2. Kompresuje obraz do JPEG z określoną jakością

#### `getImageAsByteArraySize`
```kotlin
fun getImageAsByteArraySize(image: ByteArray): ImageSize
```

**Opis:** Pobiera wymiary obrazu z danych ByteArray.

**Parametry:**
- `image` - dane obrazu

**Zwraca:** Obiekt `ImageSize` z wysokością i szerokością

### Zarządzanie listą

#### `getSelectedImageUrls`
```kotlin
fun getSelectedImageUrls(): List<String>
```

**Opis:** Pobiera listę URI wybranych obrazów.

**Zwraca:** Lista URI w formie String

#### `clearSelectedImages`
```kotlin
fun clearSelectedImages()
```

**Opis:** Czyści listę wybranych obrazów.

#### `removeSelectedImage`
```kotlin
fun removeSelectedImage(uri: String)
```

**Opis:** Usuwa konkretny obraz z listy wybranych.

**Parametry:**
- `uri` - URI obrazu do usunięcia

## Metody prywatne

### `compressImage`
```kotlin
private fun compressImage(bitmap: Bitmap, quality: Int): ByteArray
```

**Opis:** Kompresuje bitmap do formatu JPEG z określoną jakością.

**Parametry:**
- `bitmap` - bitmap do kompresji
- `quality` - jakość kompresji (0-100)

**Zwraca:** Skompresowane dane w formacie JPEG

### `fixImageRotation`
```kotlin
private fun fixImageRotation(imageBytes: ByteArray): Bitmap
```

**Opis:** Naprawia orientację obrazu na podstawie danych EXIF.

**Parametry:**
- `imageBytes` - oryginalne dane obrazu

**Zwraca:** Bitmap z poprawną orientacją

**Obsługiwane orientacje:**
- `ORIENTATION_ROTATE_90` - obrót o 90°
- `ORIENTATION_ROTATE_180` - obrót o 180°  
- `ORIENTATION_ROTATE_270` - obrót o 270°
- `ORIENTATION_FLIP_HORIZONTAL` - odbicie poziome
- `ORIENTATION_FLIP_VERTICAL` - odbicie pionowe

**Proces:**
1. Dekoduje bitmap z danych
2. Czyta metadane EXIF
3. Tworzy odpowiednią macierz transformacji
4. Stosuje transformację i zwraca nowy bitmap

## Konfiguracja

- **Domyślna jakość kompresji:** `AppConfig.DEFAULT_COMPRESSION_QUALITY`
- **Format wyjściowy:** JPEG dla kompresji
- **Selektor:** Tylko obrazy (`ImageOnly`)

## Obsługa błędów

- Wszystkie metody używają bezpiecznego mapowania z `mapNotNull`
- Graceful handling błędów w `fixImageRotation` - zwraca oryginalny bitmap
- Automatyczne pomijanie nieprawidłowych URI podczas konwersji

## Integracja z aplikacją

Serwis jest używany głównie do:
- Wybierania obrazów do galerii szafy plików
- Wysyłania obrazów w czatach
- Przetwarzania zdjęć przed przesłaniem
- Generowania miniatur i podglądów

## Ograniczenia platformowe

- **Android Only:** Wykorzystuje natywne API Android
- **Uprawnienia:** Wymaga dostępu do galerii urządzenia
- **Typy plików:** Wszystkie formaty obrazów obsługiwane przez system
- **EXIF:** Automatyczne przetwarzanie metadanych orientacji

## Uwagi implementacyjne

- Selektor obsługuje wielokrotny wybór obrazów
- Automatyczne czyszczenie listy po pobraniu danych
- Thread-safe dzięki użyciu coroutines
- Lazy initialization - wymaga wywołania `initializeWithActivity`
- Automatyczna kompresja do JPEG niezależnie od formatu wejściowego
- Zachowanie proporcji podczas transformacji obrazów
