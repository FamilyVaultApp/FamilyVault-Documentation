---
sidebar_position: 15
---

# NfcService


`NfcService` jest serwisem odpowiedzialnym za zarządzanie komunikacją NFC (Near Field Communication) w aplikacji FamilyVault. Umożliwia czytanie danych z tagów NFC oraz emulowanie tagów do udostępniania danych członkom rodziny. Obsługuje zarówno tryb odczytu jak i emulacji NFC.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `NfcAdapter` - główny interfejs NFC
- `NdefMessage` i `NdefRecord` - obsługa formatów NDEF
- `IsoDep` - komunikacja z kartami ISO 14443-4
- `Ndef` - obsługa tagów NDEF
- `HostApduService` - emulacja karty NFC

## Właściwości prywatne

- `nfcAdapter: NfcAdapter?` - adapter NFC urządzenia
- `tags: Flow<AddFamilyMemberDataPayload>` - strumień danych z odczytanych tagów

## Metody publiczne

### Strumień danych NFC

#### `tags: Flow<AddFamilyMemberDataPayload>`
**Opis:** Reaktywny strumień danych odczytywanych z tagów NFC.

**Zwraca:** Flow emitujący obiekty `AddFamilyMemberDataPayload` z odczytanych tagów

**Obsługiwane protokoły:**
- **NDEF** - standardowe tagi NFC z wiadomościami NDEF
- **IsoDep** - komunikacja z emulowanymi kartami (HCE)

**Proces odczytu NDEF:**
1. Łączy się z tagiem NDEF
2. Odczytuje wiadomość NDEF
3. Wyodrębnia payload z pierwszego rekordu
4. Parsuje status byte i długość kodu języka
5. Dekoduje tekst z odpowiednim charset (UTF-8/UTF-16)
6. Deserializuje JSON do `AddFamilyMemberDataPayload`

**Proces komunikacji IsoDep:**
1. Wysyła komendę SELECT z AID aplikacji
2. Wysyła komendę GET DATA (0xA0)
3. Sprawdza status odpowiedzi (90 00)
4. Parsuje otrzymane dane jak w przypadku NDEF
5. Deserializuje JSON do obiektu payload

### Inicjalizacja i zarządzanie

#### `registerApp`
```kotlin
suspend fun registerApp()
```

**Opis:** Inicjalizuje serwis NFC i sprawdza dostępność adaptera.

**Proces:**
- Sprawdza czy adapter NFC jest dostępny na urządzeniu
- Loguje status dostępności NFC

#### `unregisterApp`
```kotlin
fun unregisterApp()
```

**Opis:** Wyłącza wszystkie tryby NFC i zatrzymuje usługi.

**Proces:**
1. Wyłącza reader mode
2. Zatrzymuje `HostApduService`
3. Przechodzi w tryb bezczynności

### Tryby pracy

#### `setEmulateMode`
```kotlin
suspend fun setEmulateMode(data: AddFamilyMemberDataPayload)
```

**Opis:** Włącza tryb emulacji NFC do udostępniania danych.

**Parametry:**
- `data` - dane członka rodziny do udostępnienia

**Proces:**
1. Wyłącza reader mode
2. Szyfruje dane używając `PayloadEncryptor`
3. Uruchamia `HostApduService` z danymi JSON
4. Umożliwia innym urządzeniom odczyt danych

#### `setReadMode`
```kotlin
suspend fun setReadMode()
```

**Opis:** Włącza tryb odczytu NFC do skanowania tagów.

**Konfiguracja:**
- **Flagi:** `FLAG_READER_NFC_A`, `FLAG_READER_NFC_B`, `FLAG_READER_NFC_F`, `FLAG_READER_NFC_V`, `FLAG_READER_NO_PLATFORM_SOUNDS`
- **Delay:** 500ms między sprawdzeniami obecności
- **Callback:** Pusty callback (główna logika w `tags` Flow)

## Protokoły komunikacji

### Komendy IsoDep

#### SELECT Command
```
00 A4 04 00 07 D2 76 00 00 85 01 01
```
- **AID:** D2 76 00 00 85 01 01 (identyfikator aplikacji)

#### GET DATA Command
```
00 A0 00 00 00
```
- **INS:** A0 (custom instruction)
- **Zwraca:** Dane NDEF + status 90 00

### Format danych NDEF

**Status Byte:** Zawiera informacje o kodowaniu i długości kodu języka
- **Bit 7:** Kodowanie (0=UTF-8, 1=UTF-16)
- **Bity 0-5:** Długość kodu języka

**Struktura:**
1. Status byte
2. Kod języka (np. "en")
3. Dane tekstowe (JSON)

## Obsługa błędów

- Szczegółowe logowanie wszystkich operacji z tagiem "NfcService"
- Graceful handling błędów połączenia
- Automatyczne zamykanie połączeń w blokach `finally`
- Kontynuacja operacji mimo błędów SELECT command (logowanie ostrzeżenia)

## Integracja z HostApduService

Serwis współpracuje z `HostApduService` do emulacji kart NFC:
- Przekazuje dane przez Intent extras
- Używa tego samego AID dla konsystentności
- Automatycznie zarządza lifecycle usługi

## Ograniczenia platformowe

- **Android Only:** Wykorzystuje natywne API Android NFC
- **Wymagania sprzętowe:** Urządzenie z chipem NFC
- **Uprawnienia:** Wymaga uprawnień NFC w manifeście
- **HCE Support:** Wymaga wsparcia dla Host Card Emulation

## Uwagi implementacyjne

- Używa `callbackFlow` dla reaktywnego strumienia danych
- Obsługuje wielokrotne formaty tagów (NDEF, IsoDep)
- Automatyczne wykrywanie charset na podstawie status byte
- Thread-safe dzięki coroutines
- Robust error handling z kontynuacją działania
- Szczegółowe logowanie dla debugowania
