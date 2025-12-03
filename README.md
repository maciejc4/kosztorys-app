# KosztorysPro - Aplikacja do Kosztorysowania dla Firm Wykończeniowych

## 📋 Opis

KosztorysPro to profesjonalna aplikacja webowa (PWA) stworzona z myślą o firmach wykończeniowych i remontowych. Umożliwia szybkie i precyzyjne tworzenie kosztorysów z podziałem na pomieszczenia, automatyczne wyliczanie materiałów oraz generowanie profesjonalnych dokumentów PDF.

## ✨ Główne funkcje

### 📊 Kosztorysy
- **Podział na pomieszczenia** - organizuj wycenę według łazienki, kuchni, salonu itp.
- **Tryby kosztorysowania**:
  - Tylko robocizna
  - Robocizna + materiały
- **Rabaty procentowe** - osobno dla robocizny i materiałów
- **Szybki start** - użyj szablonów remontów do natychmiastowego wypełnienia kosztorysu
- **Edycja na żywo** - wszystkie ceny i ilości można modyfikować

### 📦 Szablony pozycji
- Bogata baza usług i materiałów (65+ pozycji)
- Wyszukiwarka
- Podział na robociznę i materiały
- Możliwość dodawania własnych pozycji

### 🔧 Szablony prac
- Prace z automatyczną listą materiałów
- np. "Malowanie ścian" = robocizna + farba + grunt
- Przeliczniki ilości (np. 0.15l farby/m²)
- Przypisanie do typów pomieszczeń
- **Możliwość tworzenia własnych szablonów prac**
- Wyszukiwarka

### 🏠 Szablony remontów
- Gotowe pakiety prac dla całych pomieszczeń
- np. "Remont łazienki - kompleksowy"
- Jednym klikiem dodajesz wszystkie prace + materiały
- **Możliwość tworzenia własnych szablonów remontów**
- Wyszukiwarka

### 📄 Eksport PDF
- Profesjonalny wygląd dokumentu
- Pełne wsparcie polskich znaków
- **3 poziomy szczegółowości**:
  - Uproszczony (tylko podsumowanie)
  - Standardowy (pozycje bez cen jednostkowych)
  - Szczegółowy (pełna specyfikacja)
- Podział na pomieszczenia
- Automatyczne obliczenia

### 👤 Panel użytkownika
- Unikalny ID do logowania
- Dane przechowywane lokalnie (localStorage)
- Możliwość instalacji jako aplikacja mobilna (PWA)

### 🔐 Panel administratora
- Dostęp przez ukryty URL: `/#admin`
- Przeglądanie wszystkich użytkowników
- Zarządzanie kosztorysami
- Podgląd i edycja szablonów
- Usuwanie użytkowników

## 🚀 Instalacja

```bash
# Klonowanie repozytorium
git clone [url]
cd kosztorys-app

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Budowanie produkcyjne
npm run build

# Podgląd wersji produkcyjnej
npm run preview
```

## 💻 Technologie

- **React 19** - framework UI
- **TypeScript** - typowanie
- **Vite** - bundler
- **jsPDF** - generowanie PDF
- **PWA** - możliwość instalacji offline

## 📱 PWA

Aplikacja działa jako Progressive Web App:
- Możliwość instalacji na urządzeniu
- Działa offline (dane w localStorage)
- Responsywna - działa na telefonie, tablecie i komputerze

## 🔑 Dostęp do panelu admina

URL: `twoja-domena.pl/#admin`

Panel umożliwia:
- Przeglądanie listy użytkowników
- Podgląd kosztorysów każdego użytkownika
- Edycję i usuwanie danych
- Eksport kosztorysów

## 📝 Licencja

MIT License

## 👨‍💻 Autor

Stworzone z myślą o polskich firmach remontowych.

---

## 📞 Kontakt i wsparcie

W razie pytań lub sugestii - otwórz Issue na GitHubie.
