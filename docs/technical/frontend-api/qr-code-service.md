---
sidebar_position: 17
---

# QrCodeService

## Opis ogólny

`QrCodeService` jest serwisem odpowiedzialnym za skanowanie kodów QR w aplikacji FamilyVault. Umożliwia uruchamianie systemowego skanera kodów QR, obsługę wyniku skanowania oraz dekodowanie zaszyfrowanych danych członków rodziny z kodów QR.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `GmsBarcodeScanning` - systemowy skaner Google ML Kit
- `GmsBarcodeScannerOptions` - konfiguracja skanera
- `PayloadDecryptor` - odszyfrowywanie danych z kodów QR
- `MlKitException` - obsługa błędów ML Kit

## Wyjątki

Serwis definiuje własne wyjątki dla różnych scenariuszy błędów:
- `QrCodeCancellationException` - anulowanie skanowania przez użytkownika
- `QrCodeScannerNotInstalledException` - brak zainstalowanego skanera
- `QrCodeScannerErrorException` - błąd skanera
- `QrCodeBadScanException` - nieprawidłowy lub nieszyfrowany kod QR

## Metody publiczne

### `scanQRCode`
```kotlin
suspend fun scanQRCode(): QrCodeScanResponse
```

**Opis:** Uruchamia systemowy skaner kodów QR i zwraca surowy wynik skanowania.

**Zwraca:** Obiekt `QrCodeScanResponse` zawierający status i dane

**Konfiguracja skanera:**
- **Format:** `Barcode.FORMAT_QR_CODE` (tylko kody QR)
- **Tryb:** Asynchroniczny z callback'ami

**Możliwe statusy odpowiedzi:**
- `QrCodeScanResponseStatus.SUCCESS` - pomyślne skanowanie
- `QrCodeScanResponseStatus.CANCELED` - anulowanie przez użytkownika
- `QrCodeScanResponseStatus.ERROR` - błąd skanowania

**Proces:**
1. Konfiguruje skaner tylko dla kodów QR
2. Uruchamia skanowanie w trybie asynchronicznym
3. Rejestruje callback'i dla różnych scenariuszy
4. Zwraca odpowiedź z surowym tekstem z kodu QR

### `scanPayload`
```kotlin
suspend fun scanPayload(): AddFamilyMemberDataPayload
```

**Opis:** Skanuje kod QR i dekoduje zaszyfrowane dane członka rodziny.

**Zwraca:** Obiekt `AddFamilyMemberDataPayload` z danymi nowego członka

**Wyjątki:**
- `QrCodeCancellationException` - gdy użytkownik anuluje skanowanie
- `QrCodeScannerNotInstalledException` - gdy skaner ML Kit nie jest dostępny (kod błędu `CODE_SCANNER_UNAVAILABLE`)
- `QrCodeScannerErrorException` - inne błędy skanera
- `QrCodeBadScanException` - gdy kod QR jest null lub nie zawiera prawidłowych danych

**Proces:**
1. Wywołuje `scanQRCode()` do pobrania surowych danych
2. Sprawdza status skanowania i obsługuje błędy
3. Sprawdza czy zawartość kodu nie jest null
4. Próbuje odszyfrować dane używając `PayloadDecryptor`
5. Zwraca zdekodowane dane członka rodziny

## Obsługa błędów

### Anulowanie skanowania
```kotlin
if (scannedResult.status == QrCodeScanResponseStatus.CANCELED) {
    throw QrCodeCancellationException()
}
```

### Błędy skanera
```kotlin
if (scannedResult.status == QrCodeScanResponseStatus.ERROR) {
    if (scannedResult.error is MlKitException && 
        scannedResult.error.errorCode == MlKitException.CODE_SCANNER_UNAVAILABLE) {
        throw QrCodeScannerNotInstalledException(scannedResult.error.toString())
    } else {
        throw QrCodeScannerErrorException(scannedResult.error?.toString())
    }
}
```

### Nieprawidłowe dane
```kotlin
if (scannedResult.content == null) {
    throw QrCodeBadScanException("Scanned code is null")
}

// W bloku try-catch dla PayloadDecryptor
catch (e: Exception) {
    throw QrCodeBadScanException(e.toString())
}
```

## Integracja z Google ML Kit

- **Scanner Options:** Konfiguruje skaner tylko dla kodów QR
- **Callback System:** Używa `addOnSuccessListener`, `addOnCanceledListener`, `addOnFailureListener`
- **Error Handling:** Specjalna obsługa dla `CODE_SCANNER_UNAVAILABLE`

## Integracja z aplikacją

Serwis jest używany głównie do:
- Skanowania kodów QR z danymi nowych członków rodziny
- Procesu dołączania do grup rodzinnych przez kody QR
- Bezpiecznego transferu danych uwierzytelniających

## Bezpieczeństwo

- Dane w kodach QR są szyfrowane przez `PayloadEncryptor`/`PayloadDecryptor`
- Automatyczna walidacja formatu i zawartości kodu QR
- Graceful handling nieprawidłowych lub uszkodzonych kodów

## Ograniczenia platformowe

- **Android Only:** Wykorzystuje Google ML Kit dostępny tylko na Android
- **Wymagania:** Google Play Services z ML Kit
- **Uprawnienia:** Wymaga dostępu do kamery (zarządzane przez ML Kit)
- **Instalacja:** Może wymagać pobrania dodatkowych komponentów ML Kit

## Uwagi implementacyjne

- Używa `suspendCoroutine` dla asynchronicznego API ML Kit
- Thread-safe dzięki coroutines
- Automatyczne zarządzanie lifecycle skanera
- Szczegółowa obsługa różnych typów błędów
- Tylko kody QR (nie obsługuje innych formatów kodów kreskowych)
