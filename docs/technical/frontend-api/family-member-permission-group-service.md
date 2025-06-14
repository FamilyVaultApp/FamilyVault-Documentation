---
sidebar_position: 5
---

# FamilyMemberPermissionGroupService

## Opis ogólny

`FamilyMemberPermissionGroupService` jest serwisem odpowiedzialnym za zarządzanie grupami uprawnień członków rodziny w aplikacji FamilyVault. Umożliwia zmianę poziomu uprawnień użytkowników w grupie rodzinnej, na przykład przyznanie lub odebranie uprawnień opiekuna (Guardian).

## Zależności

Serwis korzysta z następujących komponentów:
- `IFamilyGroupSessionService` - zarządzanie sesją grupy rodzinnej
- `IFamilyVaultBackendClient` - komunikacja z backendem FamilyVault

## Metody publiczne

### `changeFamilyMemberPermissionGroup`
```kotlin
suspend fun changeFamilyMemberPermissionGroup(
    userId: String,
    permissionGroup: FamilyGroupMemberPermissionGroup
)
```

**Opis:** Zmienia grupę uprawnień określonego członka grupy rodzinnej.

**Parametry:**
- `userId` - identyfikator użytkownika, którego uprawnienia mają zostać zmienione
- `permissionGroup` - nowa grupa uprawnień do przypisania

**Możliwe grupy uprawnień:**
- `FamilyGroupMemberPermissionGroup.Guardian` - opiekun z pełnymi uprawnieniami
- `FamilyGroupMemberPermissionGroup.Member` - zwykły członek z ograniczonymi uprawnieniami

**Proces:**
1. Pobiera identyfikator kontekstu aktualnej grupy rodzinnej z sesji
2. Wysyła żądanie do backendu z danymi o zmianie uprawnień
3. Backend aktualizuje uprawnienia użytkownika w grupie

## Model żądania

### ChangeFamilyMemberPermissionGroupRequest
```kotlin
data class ChangeFamilyMemberPermissionGroupRequest(
    val contextId: String,                              // Identyfikator kontekstu grupy
    val userId: String,                                 // Identyfikator użytkownika
    val permissionGroup: FamilyGroupMemberPermissionGroup  // Nowa grupa uprawnień
)
```

## Uprawnienia i ograniczenia

- **Wymagania:** Tylko użytkownicy z uprawnieniami Guardian mogą zmieniać uprawnienia innych członków
- **Kontekst:** Operacja jest wykonywana w kontekście aktualnej sesji grupy rodzinnej
- **Asynchroniczność:** Operacja jest asynchroniczna i wymaga połączenia z backendem

## Zastosowanie

Ten serwis jest używany gdy:
- Opiekun chce nadać uprawnienia Guardian nowemu członkowi rodziny
- Opiekun chce odebrać uprawnienia Guardian innemu członkowi
- Administratorzy chcą zarządzać hierarchią uprawnień w grupie

## Uwagi implementacyjne

- Serwis jest bardzo prosty i działa jako fasada dla wywołania API backendu
- Nie zawiera lokalnej walidacji uprawnień - zakłada, że użytkownik ma odpowiednie uprawnienia
- Wszystkie sprawdzenia uprawnień są wykonywane po stronie backendu
- Operacja wymaga aktywnej sesji grupy rodzinnej
- Nie obsługuje bezpośrednio efektów ubocznych zmiany uprawnień (np. aktualizacji czatów)

## Bezpieczeństwo

- Operacje są autoryzowane przez backend na podstawie aktualnej sesji
- Identyfikator kontekstu jest automatycznie pobierany z bezpiecznej sesji
- Wszystkie zmiany uprawnień są logowane i audytowane przez backend
