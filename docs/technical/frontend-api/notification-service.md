---
sidebar_position: 16
---

# NotificationService


`NotificationService` jest serwisem odpowiedzialnym za zarządzanie powiadomieniami push w aplikacji FamilyVault. Umożliwia tworzenie kanałów powiadomień, wysyłanie powiadomień oraz zarządzanie uprawnieniami do wyświetlania powiadomień.

**Uwaga:** Aktualnie serwis jest dostępny tylko na platformie Android.

## Zależności

Serwis korzysta z następujących komponentów Android:
- `NotificationManager` - zarządzanie powiadomieniami systemowymi
- `NotificationChannel` - tworzenie kanałów powiadomień (API 26+)
- `NotificationCompat.Builder` - kompatybilne budowanie powiadomień
- `ActivityCompat` - zarządzanie uprawnieniami

## Właściwości prywatne

- `context: Context` - kontekst aplikacji
- `channelId: String` - identyfikator kanału powiadomień (z `AppConfig.NOTIFICATION_CHANNEL_NAME`)

## Inicjalizacja

### Konstruktor i konfiguracja kanału
```kotlin
init {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val importance = NotificationManager.IMPORTANCE_DEFAULT
        val channel = NotificationChannel(channelId, AppConfig.NOTIFICATION_CHANNEL_NAME, importance).apply {
            description = AppConfig.NOTIFICATION_CHANNEL_DESCRIPTION
        }

        val notificationManager: NotificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
}
```

**Opis:** Automatycznie tworzy kanał powiadomień przy inicjalizacji serwisu (dla Android 8.0+).

**Konfiguracja kanału:**
- **Nazwa:** `AppConfig.NOTIFICATION_CHANNEL_NAME`
- **Opis:** `AppConfig.NOTIFICATION_CHANNEL_DESCRIPTION`
- **Ważność:** `IMPORTANCE_DEFAULT`

## Metody publiczne

### Zarządzanie uprawnieniami

#### `requestNotificationsPermission`
```kotlin
override fun requestNotificationsPermission()
```

**Opis:** Żąda uprawnień do wyświetlania powiadomień od użytkownika.

**Warunki:**
- Działa tylko na Android 13+ (API 33+)
- Sprawdza czy uprawnienia nie są już przyznane

**Proces:**
1. Sprawdza wersję API (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
2. Weryfikuje czy uprawnienia nie są już przyznane
3. Używa `ActivityCompat.requestPermissions()` z uprawnieniem `POST_NOTIFICATIONS`
4. Przekazuje `NOTIFICATION_PERMISSION_REQUEST_CODE` jako kod żądania

#### `checkNotificationPermission`
```kotlin
override fun checkNotificationPermission(): Boolean
```

**Opis:** Sprawdza czy aplikacja ma uprawnienia do wysyłania powiadomień.

**Zwraca:** `true` jeśli uprawnienia są przyznane, `false` w przeciwnym razie

**Proces:**
- Używa `ActivityCompat.checkSelfPermission()` z uprawnieniem `POST_NOTIFICATIONS`
- Porównuje wynik z `PackageManager.PERMISSION_GRANTED`

### Wysyłanie powiadomień

#### `sendNotification`
```kotlin
override fun sendNotification(title: String, content: String)
```

**Opis:** Wysyła powiadomienie z podanym tytułem i treścią.

**Parametry:**
- `title` - tytuł powiadomienia
- `content` - treść powiadomienia

**Konfiguracja powiadomienia:**
- **Ikona:** `android.R.drawable.ic_dialog_info` (systemowa ikona informacji)
- **Priorytet:** `NotificationCompat.PRIORITY_HIGH`
- **ID:** `System.currentTimeMillis().toInt()` (unikalny timestamp)

**Proces:**
1. Sprawdza uprawnienia przed wysłaniem
2. Tworzy powiadomienie używając `NotificationCompat.Builder`
3. Ustawia kanał, ikonę, tytuł, treść i priorytet
4. Wysyła powiadomienie z unikalnym ID opartym na timestamp
5. Pomija wysyłanie jeśli brak uprawnień

## Konfiguracja

Serwis używa następujących stałych z `AppConfig`:
- `NOTIFICATION_CHANNEL_NAME` - nazwa kanału powiadomień
- `NOTIFICATION_CHANNEL_DESCRIPTION` - opis kanału powiadomień  
- `NOTIFICATION_PERMISSION_REQUEST_CODE` - kod żądania uprawnień

## Obsługa wersji Android

### Android 8.0+ (API 26+)
- Automatyczne tworzenie kanału powiadomień w konstruktorze
- Używa `NotificationChannel` dla zgodności z nowymi wymaganiami

### Android 13+ (API 33+)
- Obsługuje nowe uprawnienie `POST_NOTIFICATIONS`
- Żąda uprawnień tylko na odpowiednich wersjach systemu

### Starsze wersje
- Graceful handling - nie żąda uprawnień na starszych wersjach
- Kanały nie są tworzone (nie są wymagane)

## Ograniczenia platformowe

- **Android Only:** Wykorzystuje natywne API Android
- **Minimalna wersja:** Kompatybilne z wszystkimi wersjami, optymalizowane dla API 26+
- **Uprawnienia:** Automatycznie żąda uprawnień na Android 13+

## Uwagi implementacyjne

- Używa `NotificationCompat` dla maksymalnej kompatybilności
- Unikalny ID powiadomień oparty na timestamp zapobiega nadpisywaniu
- Automatyczne tworzenie kanału przy inicjalizacji
- Graceful handling różnych wersji Android
- Nie wysyła powiadomień bez odpowiednich uprawnień
- Domyślna ikona systemowa (może wymagać customizacji)

