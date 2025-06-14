---
sidebar_position: 8
---

# SavedFamilyGroupsService

## Opis ogólny

`SavedFamilyGroupsService` jest serwisem odpowiedzialnym za zarządzanie zapisanymi poświadczeniami grup rodzinnych w aplikacji FamilyVault. Umożliwia pobieranie listy wszystkich zapisanych grup, zarządzanie konkretnymi poświadczeniami oraz zmienianie ustawień domyślnych grup.

## Zależności

Serwis korzysta z następujących komponentów:
- `IFamilyGroupCredentialsRepository` - repozytorium do przechowywania poświadczeń grup rodzinnych

## Metody publiczne

### Pobieranie zapisanych grup

#### `getAllSavedFamilyGroups`
```kotlin
suspend fun getAllSavedFamilyGroups(): List<FamilyGroup>
```

**Opis:** Pobiera listę wszystkich zapisanych grup rodzinnych.

**Zwraca:** Lista obiektów `FamilyGroup` reprezentujących zapisane grupy

**Proces:**
1. Pobiera wszystkie poświadczenia z repozytorium
2. Mapuje każde poświadczenie na obiekt `FamilyGroup` używając `FamilyGroupCredentialToFamilyGroupMapper`

### Zarządzanie konkretnymi poświadczeniami

#### `getSavedFamilyGroupCredential`
```kotlin
suspend fun getSavedFamilyGroupCredential(
    contextId: String,
    memberPublicKey: String
): FamilyGroupCredential
```

**Opis:** Pobiera konkretne poświadczenia grupy rodzinnej na podstawie identyfikatorów.

**Parametry:**
- `contextId` - identyfikator kontekstu grupy rodzinnej
- `memberPublicKey` - klucz publiczny członka

**Zwraca:** Obiekt `FamilyGroupCredential` z pełnymi poświadczeniami

**Zastosowanie:** Używane gdy aplikacja potrzebuje dostępu do konkretnych poświadczeń grupy

### Zarządzanie ustawieniami domyślnymi

#### `changeDefaultFamilyGroupCredential`
```kotlin
suspend fun changeDefaultFamilyGroupCredential(
    contextId: String,
    memberPublicKey: String
)
```

**Opis:** Ustawia określoną grupę rodzinną jako domyślną.

**Parametry:**
- `contextId` - identyfikator kontekstu grupy rodzinnej
- `memberPublicKey` - klucz publiczny członka

**Zastosowanie:** Pozwala użytkownikowi wybrać, która grupa będzie automatycznie ładowana przy starcie aplikacji

#### `changeFamilyGroupName`
```kotlin
suspend fun changeFamilyGroupName(
    contextId: String,
    familyName: String
)
```

**Opis:** Aktualizuje nazwę grupy rodzinnej w zapisanych poświadczeniach.

**Parametry:**
- `contextId` - identyfikator kontekstu grupy rodzinnej
- `familyName` - nowa nazwa grupy

**Zastosowanie:** Synchronizuje lokalnie zapisaną nazwę grupy z nazwą na serwerze

## Model danych

### FamilyGroup
Obiekt reprezentujący podstawowe informacje o grupie rodzinnej (utworzony przez mapper).

### FamilyGroupCredential
Obiekt zawierający pełne poświadczenia potrzebne do połączenia z grupą rodzinną, w tym:
- Identyfikator kontekstu
- Klucze szyfrowania
- Dane uwierzytelniania
- Metadane grupy

## Mapowanie danych

Serwis używa `FamilyGroupCredentialToFamilyGroupMapper` do konwersji szczegółowych poświadczeń na uproszczone obiekty `FamilyGroup` do wyświetlenia w interfejsie użytkownika.

## Uwagi implementacyjne

- Wszystkie operacje są asynchroniczne (używają `suspend`)
- Serwis działa jako fasada dla `IFamilyGroupCredentialsRepository`
- Nie zawiera logiki biznesowej - deleguje wszystkie operacje do repozytorium
- Obsługuje mapowanie typów danych między warstwą danych a warstwą prezentacji
- Nie wykonuje walidacji danych - zakłada poprawność parametrów wejściowych

## Bezpieczeństwo

- Poświadczenia są przechowywane lokalnie w zaszyfrowanej formie przez repozytorium
- Serwis nie modyfikuje ani nie eksponuje wrażliwych danych szyfrowania
- Identyfikacja grup odbywa się przez kombinację `contextId` i `memberPublicKey`

## Zastosowanie

Ten serwis jest używany głównie w:
- Ekranach wyboru grupy rodzinnej
- Zarządzaniu wieloma grupami rodzinnymi
- Ustawieniach aplikacji do zmiany domyślnej grupy
- Synchronizacji nazw grup między serwerem a lokalną bazą danych
