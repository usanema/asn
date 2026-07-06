#!/usr/bin/env python3
import urllib.request
import json
import sys
import os

url = "http://127.0.0.1:8090"
print("=== PocketBase Automatyczny Importer Schematu ===")
email = input("Podaj email admina / superuser: ").strip()
password = input("Podaj hasło admina / superuser: ").strip()

auth_endpoints = [
    "/api/collections/_superusers/auth-with-password", # v0.23+
    "/api/admins/auth-with-password"                   # v0.22 i starsze
]

token = None
for ep in auth_endpoints:
    try:
        req = urllib.request.Request(
            f"{url}{ep}",
            data=json.dumps({"identity": email, "password": password}).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode('utf-8'))
            token = res_data.get("token")
            if token:
                print(f"-> Zalogowano pomyślnie ({ep})!")
                break
    except Exception as e:
        continue

if not token:
    print("-> BŁĄD: Nie udało się zalogować. Sprawdź email, hasło i czy PocketBase działa na porcie 8090.")
    sys.exit(1)

schema_file = "pocketbase-schema.json"
if not os.path.exists(schema_file):
    print(f"-> BŁĄD: Brak pliku {schema_file} w obecnym katalogu!")
    sys.exit(1)

with open(schema_file, "r", encoding="utf-8") as f:
    schema = json.load(f)

import_url = f"{url}/api/collections/import"
req = urllib.request.Request(
    import_url,
    data=json.dumps({"collections": schema, "deleteMissing": False}).encode('utf-8'),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"{token}"
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        print("-> SUKCES! Zaimportowano wszystkie 7 kolekcji (global_settings, navigation, home_page, about_page, services_page, experience_page, contact_page)!")
except Exception as e:
    print(f"-> Błąd importu API: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
