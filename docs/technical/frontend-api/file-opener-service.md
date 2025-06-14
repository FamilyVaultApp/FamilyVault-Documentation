---
sidebar_position: 13
---

# FileOpenerService

## Opis ogólny

`FileOpenerService` jest serwisem odpowiedzialnym za otwieranie i pobieranie plików w aplikacji FamilyVault. Umożliwia otwieranie plików w zewnętrznych aplikacjach oraz pobieranie plików do folderu Downloads na urządzeniu.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `FileProvider` - bezpieczne udostępnianie plików między aplikacjami
- `MediaScannerConnection` - powiadamianie systemu o nowych plikach
- `Intent` - uruchamianie zewnętrznych aplikacji
- `Environment` - dostęp do folderów systemowych

## Właściwości prywatne

- `TAG = "FileOpenerService"` - tag do logowania
- `context: Context` - kontekst aplikacji

## Metody publiczne

### `openFileWithExternalViewer`
```kotlin
fun openFileWithExternalViewer(
    fileBytes: ByteArray,
    mimeType: String,
    fileName: String
): Boolean
```

**Opis:** Otwiera plik w zewnętrznej aplikacji (domyślnie jako PDF).

**Parametry:**
- `fileBytes` - dane pliku w formacie ByteArray
- `mimeType` - typ MIME pliku (aktualnie nieużywany - hardcoded PDF)
- `fileName` - nazwa pliku

**Zwraca:** `true` jeśli operacja zakończyła się sukcesem, `false` w przeciwnym razie

**Proces:**
1. Tworzy tymczasowy plik za pomocą `createTempFile()`
2. Generuje content URI używając `FileProvider`
3. Tworzy Intent z akcją `ACTION_VIEW` i typem `application/pdf`
4. Próbuje ustawić Google Drive jako domyślną aplikację (API 29+)
5. Przyznaje uprawnienia do odczytu wszystkim dostępnym aplikacjom
6. Wyświetla chooser z dostępnymi aplikacjami PDF
7. Pokazuje Toast z błędem jeśli brak aplikacji do obsługi PDF

### `downloadFile`
```kotlin
fun downloadFile(fileBytes: ByteArray, fileName: String): String?
```

**Opis:** Pobiera plik do folderu Downloads i próbuje otworzyć folder lub plik.

**Parametry:**
- `fileBytes` - dane pliku w formacie ByteArray
- `fileName` - nazwa pliku

**Zwraca:** Ścieżka do pobranego pliku lub null w przypadku błędu

**Proces:**
1. Dodaje rozszerzenie `.pdf` jeśli plik jest PDF-em
2. Generuje unikalną nazwę z timestamp
3. Zapisuje plik w folderze Downloads
4. Powiadamia MediaScanner o nowym pliku
5. Pokazuje Toast z informacją o pobraniu
6. Próbuje otworzyć folder Downloads
7. Jako fallback próbuje otworzyć bezpośrednio plik

## Metody prywatne

### `createTempFile`
```kotlin
private fun createTempFile(fileBytes: ByteArray, fileName: String): File
```

**Opis:** Tworzy tymczasowy plik w odpowiednim katalogu.

**Parametry:**
- `fileBytes` - dane pliku
- `fileName` - nazwa pliku

**Zwraca:** Obiekt File reprezentujący utworzony plik

**Proces:**
1. Dodaje rozszerzenie `.pdf` jeśli wykryto plik PDF
2. Wybiera katalog: Documents → Downloads → cache (w tej kolejności)
3. Generuje unikalną nazwę z timestamp
4. Zapisuje dane do pliku

## Konfiguracja FileProvider

Serwis używa authority: `"${context.packageName}.fileprovider"` do bezpiecznego udostępniania plików.

## Obsługa błędów

- Wszystkie metody używają try-catch z szczegółowym logowaniem
- Błędy są wyświetlane użytkownikowi przez Toast
- Graceful fallback przy problemach z otwieraniem folderów/plików
- Automatyczne wykrywanie typu pliku PDF przez `FileTypeUtils.isPdfFile()`

## Integracja z systemem

### Google Drive Integration
Na API level 29+ próbuje ustawić Google Drive jako domyślną aplikację do PDF:
- Sprawdza dostępność `com.google.android.apps.docs`
- Ustawia jako preferowaną aplikację jeśli dostępna

### MediaScanner Integration
- Automatycznie powiadamia system o nowych plikach w Downloads
- Ustawia typ MIME na `application/pdf` dla skanowania

### Intent Handling
- Używa `Intent.createChooser()` dla wyboru aplikacji
- Automatyczne przyznawanie uprawnień `FLAG_GRANT_READ_URI_PERMISSION`
- Obsługa fallback dla różnych scenariuszy otwierania plików

## Ograniczenia platformowe

- **Android Only:** Wykorzystuje natywne API Android
- **Uprawnienia:** Wymaga dostępu do External Storage
- **FileProvider:** Wymaga konfiguracji w AndroidManifest.xml
- **Typ plików:** Optimized dla PDF, inne typy traktowane jako PDF

## Uwagi implementacyjne

- Hardcoded typ MIME na `application/pdf` niezależnie od parametru
- Automatyczne dodawanie rozszerzenia `.pdf` dla plików PDF
- Unikalne nazwy plików z timestamp dla unikania kolizji
- Szczegółowe logowanie wszystkich operacji
- Toast notifications dla feedback użytkownika
- Graceful handling braku aplikacji do obsługi plików
