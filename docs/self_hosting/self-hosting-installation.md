---
sidebar_position: 1
---

# Uruchomienie własnego serwera

Najprostszym i zalecanym przez nas sposobem uruchomienia serwera FamilyVault jest obraz Dockerowy.

Przed wykorzystaniem tej metody musisz zapewnić działające instancje serwera PrivMX oraz MongoDB. Więcej informacji
znajdziesz [tutaj](https://github.com/simplito/privmx-bridge-docker).

Obraz FamilyVaultServer możesz pobrać wykorzystując następujące polecenie:

```shell
docker pull ghcr.io/familyvaultapp/familyvaultserver:latest
```

Skonfigurować skonteneryzowany serwer FamilyVault możesz za pomocą zmiennych środowiskowych. Uruchomienie serwera z
przykładową konfiguracją:

```shell
docker run
  -p 8080:8080
  -e PrivMx__Url="https://192.168.0.2:9111"
  -e PrivMx__ApiKeyId="ecf27cdb0d06919fd9c626d81382fc03"
  -e PrivMx__ApiKeySecret="8094267e11feb9733543783f393f3b46"
  ghcr.io/familyvaultapp/familyvaultserver:latest
```

Opis przykładowej konfiguracji

- _PrivMx__Url_ – adres URL serwera PrivMX, z którym ma się komunikować FamilyVault. P
- _PrivMx__ApiKeyId_ – identyfikator klucza API wygenerowany przez PrivMx Bridge.
- _PrivMx__ApiKeySecret_ – tajny klucz wygenerowany przez PrivMx Bridge.

> **Uwaga!** Pamiętaj, że adres _PrivMx_Url_ zostanie przesłany także do hostów, dlatego musi być dla nich też dostępny!