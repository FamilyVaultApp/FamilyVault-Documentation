---
sidebar_position: 11
---

# AudioRecorderService


`AudioRecorderService` jest serwisem odpowiedzialnym za nagrywanie audio w aplikacji FamilyVault. Umożliwia rozpoczynanie i zatrzymywanie nagrywania dźwięku z mikrofonu oraz zarządzanie uprawnieniami do nagrywania.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `AudioRecord` - niskopoziomowe nagrywanie audio
- `MediaRecorder` - źródło audio z mikrofonu
- `AudioFormat` - definicja formatu audio
- `CoroutineScope` - zarządzanie asynchronicznymi operacjami
- `ActivityCompat` - zarządzanie uprawnieniami

## Właściwości prywatne

- `isRecording: Boolean` - flaga określająca czy nagrywanie jest aktywne
- `audioRecord: AudioRecord?` - instancja nagrywacza audio
- `recordingJob: Job?` - zadanie odpowiedzialne za ciągłe nagrywanie
- `outputStream: ByteArrayOutputStream` - strumień do zbierania danych audio
- `bufferSize: Int` - rozmiar bufora audio obliczony dla optymalnej wydajności

## Konfiguracja audio

- **Częstotliwość próbkowania:** `AppConfig.AUDIO_SAMPLE_RATE`
- **Format kanału:** `CHANNEL_IN_MONO` (mono)
- **Kodowanie:** `ENCODING_PCM_16BIT` (16-bit PCM)
- **Źródło audio:** `MediaRecorder.AudioSource.MIC` (mikrofon)

## Metody publiczne

### `start()`
```kotlin
fun start()
```

**Opis:** Rozpoczyna nagrywanie audio z mikrofonu.

**Warunki wstępne:**
- Nagrywanie nie może być już aktywne
- Użytkownik musi mieć uprawnienia do nagrywania

**Proces:**
1. Sprawdza czy nagrywanie nie jest już aktywne i czy są uprawnienia
2. Inicjalizuje nowy `ByteArrayOutputStream`
3. Konfiguruje `AudioRecord` z odpowiednimi parametrami
4. Rozpoczyna nagrywanie
5. Uruchamia coroutine w `Dispatchers.IO` do ciągłego czytania danych
6. W pętli czyta dane z bufora i zapisuje do strumienia wyjściowego

### `stop()`
```kotlin
fun stop(): ByteArray
```

**Opis:** Zatrzymuje nagrywanie i zwraca nagrane dane audio.

**Zwraca:** Nagrane dane audio w formacie ByteArray (PCM 16-bit)

**Proces:**
1. Sprawdza czy nagrywanie jest aktywne
2. Anuluje zadanie nagrywania
3. Zatrzymuje i zwalnia `AudioRecord`
4. Zamyka strumień wyjściowy
5. Resetuje flagę nagrywania
6. Zwraca zebrane dane audio

**Uwaga:** Jeśli nagrywanie nie było aktywne, zwraca pustą tablicę bajtów

### Zarządzanie uprawnieniami

#### `requestRecordingPermission()`
```kotlin
fun requestRecordingPermission()
```

**Opis:** Żąda uprawnień do nagrywania audio od użytkownika.

**Proces:**
1. Sprawdza czy uprawnienia nie są już przyznane
2. Używa `ActivityCompat.requestPermissions()` do wysłania żądania
3. Żąda uprawnienia `Manifest.permission.RECORD_AUDIO`

#### `haveRecordingPermission()`
```kotlin
fun haveRecordingPermission(): Boolean
```

**Opis:** Sprawdza czy aplikacja ma uprawnienia do nagrywania audio.

**Zwraca:** `true` jeśli uprawnienia są przyznane, `false` w przeciwnym razie

## Stałe konfiguracyjne

- **`RECORDING_PERMISSION_REQUEST_CODE = 1002`** - kod żądania uprawnień
- **`SAMPLE_RATE`** - pobierana z `AppConfig.AUDIO_SAMPLE_RATE`

## Zarządzanie lifecycle

### Bezpieczeństwo wątków
- Nagrywanie odbywa się w kontekście `Dispatchers.IO`
- Operacje na UI mogą być wykonywane bezpiecznie z głównego wątku
- Automatyczne anulowanie zadania przy zatrzymywaniu

### Zarządzanie zasobami
- Automatyczne zwalnianie `AudioRecord` po zakończeniu
- Czyszczenie strumienia wyjściowego
- Resetowanie wszystkich referencji

## Obsługa błędów

- Metody nie rzucają wyjątków - używają sprawdzania warunków wstępnych
- Brak uprawnień powoduje ciche zakończenie operacji `start()`
- Wywoływanie `stop()` bez aktywnego nagrywania zwraca pustą tablicę


## Ograniczenia platformowe

- **Android Only:** Serwis wykorzystuje natywne API Android
- **Uprawnienia:** Wymaga `RECORD_AUDIO` permission
- **Minimalna wersja:** Wymaga API level obsługującego `AudioRecord`

## Uwagi implementacyjne

- Format wyjściowy: PCM 16-bit mono
- Bufor jest automatycznie obliczany dla optymalnej wydajności
- Nagrywanie działa w trybie ciągłym do momentu zatrzymania
- Thread-safe dzięki użyciu coroutines
- Nie obsługuje pauzy - tylko start/stop
