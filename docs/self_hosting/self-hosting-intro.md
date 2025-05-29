---
sidebar_position: 1
---


# Samodzielna konfiguracja serwera FamilyVault

Aby samodzielnie uruchomić backend **FamilyVault Server**, potrzebujesz lokalnie lub na serwerze skonfigurować środowisko z zależnościami:

#### 🔧 Wymagania:
- .NET SDK 8.0
- MongoDB
- PrivMX Bridge (działający lokalnie lub zdalnie)

#### ⚙️ Konfiguracja:
Edytuj plik `appsettings.json` (lub `appsettings.Development.json`) i uzupełnij dane dostępowe do PrivMX Bridge:
```json
"PrivMx": {
  "Url": "http://localhost:8787",
  "ApiKeyId": "twój_id_klucza_api",
  "ApiKeySecret": "twój_sekret",
  "SolutionName": "FamilyVault"
}
```

Serwer sam zapisze solutionId do pliku config/solution przy pierwszym uruchomieniu.

W katalogu głównym uruchom zależności.
> **Ważne:** Pamiętaj aby zmienić konfigurację w docker-compose! 
```
docker-compose up -d 
```

Alternatywnie możesz uruchomić serwer bez wykorzystania Dockera:

```
cd FamilyVaultServer
dotnet run
```
Domyślnie dostępny pod http://localhost:5024, dokumentacja API: http://localhost:5024/swagger.
