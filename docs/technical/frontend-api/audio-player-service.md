---
sidebar_position: 10
---

# AudioPlayerService

`AudioPlayerService` jest serwisem odpowiedzialnym za odtwarzanie nagrań audio w aplikacji FamilyVault. Umożliwia odtwarzanie danych audio w formacie PCM 16-bit oraz zarządzanie stanem odtwarzania z obsługą callback'ów po zakończeniu.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `AudioTrack` - niskopoziomowe odtwarzanie audio
- `AudioAttributes` - konfiguracja atrybutów audio
- `AudioFormat` - definicja formatu audio
- `CoroutineScope` - zarządzanie asynchronicznymi operacjami

## Właściwości prywatne

- `audioTrack: AudioTrack?` - instancja odtwarzacza audio
- `playingJob: Job?` - zadanie odpowiedzialne za strumieniowanie danych
- `audioPlayerScope: CoroutineScope` - zakres coroutine z `SupervisorJob`

## Metody publiczne

### `play`
```kotlin
fun play(audioData: ByteArray, onCompletion: (() -> Unit)?)
```

**Opis:** Odtwarza dane audio z opcjonalnym callback'iem po zakończeniu.

**Parametry:**
- `audioData` - dane audio w formacie ByteArray (PCM 16-bit)
- `onCompletion` - funkcja wywoływana po zakończeniu odtwarzania (opcjonalna)

**Konfiguracja audio:**
- **Częstotliwość próbkowania:** `AppConfig.AUDIO_SAMPLE_RATE`
- **Format kanału:** `CHANNEL_OUT_MONO` (mono)
- **Kodowanie:** `ENCODING_PCM_16BIT` (16-bit PCM)
- **Tryb transferu:** `MODE_STREAM` (strumieniowanie)

**Atrybuty audio:**
- **Użycie:** `USAGE_MEDIA` (odtwarzanie mediów)
- **Typ zawartości:** `CONTENT_TYPE_SPEECH` (mowa)

**Proces:**
1. Zatrzymuje poprzednie odtwarzanie (jeśli aktywne)
2. Oblicza całkowitą liczbę próbek (rozmiar danych / 2)
3. Tworzy i konfiguruje `AudioTrack`
4. Ustawia marker pozycji na końcu danych
5. Rejestruje listener dla callback'u zakończenia
6. Rozpoczyna odtwarzanie
7. Asynchronicznie zapisuje dane do `AudioTrack`

### `stop`
```kotlin
fun stop()
```

**Opis:** Zatrzymuje bieżące odtwarzanie i zwalnia zasoby.

**Proces:**
1. Anuluje zadanie strumieniowania (`playingJob`)
2. Zatrzymuje `AudioTrack`
3. Zwalnia zasoby `AudioTrack`
4. Resetuje referencje na null

## Zarządzanie lifecycle

### Automatyczne zakończenie
Serwis automatycznie wywołuje `stop()` i `onCompletion` callback gdy:
- Odtwarzanie dochodzi do końca danych (marker pozycji)
- Rozpoczyna się nowe odtwarzanie (poprzednie jest przerywane)

### Obsługa wielowątkowości
- **UI Thread:** Callback `onCompletion` jest wywoływany w kontekście `Main` dispatcher
- **IO Thread:** Zapis danych audio odbywa się w kontekście `IO` dispatcher
- **SupervisorJob:** Zapobiega propagacji błędów między zadaniami

## Konfiguracja

Serwis wykorzystuje następujące konfiguracje z `AppConfig`:
- `AUDIO_SAMPLE_RATE` - częstotliwość próbkowania audio

## Uwagi implementacyjne

- **Format danych:** Obsługuje wyłącznie PCM 16-bit mono
- **Buforowanie:** Używa minimalnego rozmiaru bufora dla optymalnej wydajności
- **Zarządzanie pamięcią:** Automatyczne zwalnianie zasobów po zakończeniu
- **Thread-safe:** Bezpieczne wywołania z różnych wątków dzięki coroutines
- **Przerywanie:** Nowe odtwarzanie automatycznie przerywa poprzednie

## Ograniczenia platformowe

- **Android Only:** Serwis wykorzystuje natywne API Android
- **Minimalna wersja:** Wymaga API level obsługującego `AudioTrack.Builder`
- **Uprawnienia:** Nie wymaga dodatkowych uprawnień (tylko odtwarzanie)
