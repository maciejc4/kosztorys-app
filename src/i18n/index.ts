import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pl: {
    translation: {
      // App
      appName: 'KosztorysPro',
      appSubtitle: 'Profesjonalne wyceny dla firm remontowych',
      
      // Navigation
      nav: {
        estimates: 'Kosztorysy',
        templates: 'Szablony',
        settings: 'Ustawienia'
      },
      
      // Common
      common: {
        save: 'Zapisz',
        cancel: 'Anuluj',
        add: 'Dodaj',
        edit: 'Edytuj',
        delete: 'Usuń',
        search: 'Szukaj...',
        all: 'Wszystkie',
        name: 'Nazwa',
        price: 'Cena',
        quantity: 'Ilość',
        unit: 'Jednostka',
        category: 'Kategoria',
        description: 'Opis',
        total: 'Razem',
        labor: 'Robocizna',
        material: 'Materiał',
        materials: 'Materiały',
        discount: 'Rabat',
        noItems: 'Brak pozycji',
        confirmDelete: 'Czy na pewno chcesz usunąć?',
        createNew: '+ Utwórz nowy',
        none: 'Brak',
        allCategories: 'Wszystkie kategorie',
        quickAdd: 'Szybkie dodawanie',
        currency: 'zł',
        next: 'Dalej',
        back: 'Wstecz',
        step: 'Krok',
        of: 'z',
        notes: 'Notatki',
        notesPlaceholder: 'Dodatkowe uwagi, warunki płatności, terminy...'
      },
      
      // Login
      login: {
        companyName: 'Nazwa firmy',
        companyPlaceholder: 'np. Budmar Wykończenia',
        newAccount: 'Nowe konto',
        existingAccount: 'Mam już konto',
        yourId: 'Twój unikalny ID',
        idPlaceholder: 'np. a1b2c3d4',
        start: 'Rozpocznij',
        login: 'Zaloguj się',
        accountType: 'Typ konta',
        withSampleData: 'Z przykładowymi danymi',
        sampleDataDesc: 'Gotowe szablony prac i materiałów',
        emptyAccount: 'Puste konto',
        emptyAccountDesc: 'Zacznij od zera, dodaj własne pozycje',
        userNotFound: 'Nie znaleziono użytkownika lub konto wygasło',
        enterUsername: 'Podaj nazwę użytkownika',
        enterId: 'Podaj ID użytkownika',
        demoNotice: 'Konto demo - dane są automatycznie usuwane po {{hours}}h'
      },
      
      // Templates
      templates: {
        items: 'Pozycje',
        works: 'Prace',
        renovations: 'Remonty',
        itemTemplates: 'Szablony pozycji',
        workTemplates: 'Szablony prac',
        renovationTemplates: 'Szablony remontów',
        newItem: 'Nowa pozycja',
        editItem: 'Edytuj pozycję',
        newWork: 'Nowy szablon pracy',
        editWork: 'Edytuj szablon pracy',
        newRenovation: 'Nowy szablon remontu',
        editRenovation: 'Edytuj szablon remontu',
        workName: 'Nazwa pracy',
        workNamePlaceholder: 'np. Malowanie ścian',
        workUnit: 'Jednostka pracy',
        rooms: 'Pomieszczenia',
        roomsRequired: 'Podaj nazwę pracy i wybierz przynajmniej jedno pomieszczenie',
        itemsInWork: 'Pozycje w pracy',
        perUnit: 'na 1',
        selectItem: 'Wybierz',
        selectWork: 'Wybierz pracę...',
        addItems: 'Dodaj pozycje z listy poniżej',
        saveTemplate: 'Zapisz szablon',
        noMaterials: 'Brak materiałów',
        worksInTemplate: 'Prace w szablonie',
        roomType: 'Typ pomieszczenia',
        templateName: 'Nazwa szablonu',
        templateNamePlaceholder: 'np. Remont łazienki - kompleksowy',
        createItemFirst: 'Najpierw utwórz pozycję',
        createWorkFirst: 'Najpierw utwórz pracę',
        orCreateNew: 'lub utwórz nową',
        itemAlreadyAdded: 'Ta pozycja jest już dodana',
        workCategory: 'Kategoria pracy'
      },
      
      // Estimates
      estimates: {
        title: 'Kosztorysy',
        new: 'Nowy kosztorys',
        edit: 'Edytuj kosztorys',
        createFirst: 'Utwórz pierwszy',
        clientData: 'Dane klienta',
        clientName: 'Nazwa klienta',
        clientNamePlaceholder: 'Jan Kowalski',
        clientAddress: 'Adres',
        clientAddressPlaceholder: 'ul. Budowlana 1',
        projectDescription: 'Opis projektu',
        projectDescriptionPlaceholder: 'Remont mieszkania',
        options: 'Opcje kosztorysu',
        includeMaterials: 'Uwzględnij materiały w kosztorysie',
        laborDiscount: 'Rabat na robociznę (%)',
        materialDiscount: 'Rabat na materiały (%)',
        rooms: 'Pomieszczenia',
        addRoom: 'Dodaj pomieszczenie',
        roomName: 'Nazwa pomieszczenia',
        roomNamePlaceholder: 'np. Łazienka główna',
        addWork: 'Dodaj pracę',
        quickStart: 'Szybki start:',
        noRooms: 'Dodaj pomieszczenie',
        noDescription: 'Brak opisu',
        confirmDeleteRoom: 'Usunąć pomieszczenie?',
        confirmDeleteEstimate: 'Usunąć kosztorys?',
        enterClientName: 'Podaj nazwę klienta',
        selectWork: 'Wybierz pracę',
        workQuantity: 'Ilość',
        itemsToAdd: 'Pozycje do dodania:',
        addWorkTitle: 'Dodaj pracę',
        createWorkInline: 'Utwórz nową pracę',
        noEstimates: 'Brak kosztorysów',
        wizardStep1Title: 'Klient',
        wizardStep1Desc: 'Podstawowe informacje o kliencie i projekcie',
        wizardStep2Title: 'Pomieszczenia',
        wizardStep2Desc: 'Dodaj pomieszczenia do remontu',
        wizardStep3Title: 'Prace',
        wizardStep3Desc: 'Wybierz prace dla każdego pomieszczenia',
        wizardStep4Title: 'Podsumowanie',
        wizardStep4Desc: 'Przejrzyj i zapisz kosztorys',
        selectRoomType: 'Wybierz typ pomieszczenia',
        selectRoomTypeHint: 'Typ pomieszczenia określa dostępne prace',
        addFirstRoom: 'Dodaj pierwsze pomieszczenie',
        addAnotherRoom: 'Dodaj kolejne pomieszczenie',
        noWorksInRoom: 'Brak prac w tym pomieszczeniu',
        addWorksHint: 'Kliknij "Dodaj pracę" aby dodać prace remontowe',
        useTemplate: 'Użyj szablonu',
        applyTemplateHint: 'Gotowy zestaw prac dla tego typu pomieszczenia',
        discountsOptional: 'Rabaty (opcjonalne)',
        notesOptional: 'Notatki (opcjonalne)'
      },
      
      // PDF
      pdf: {
        export: 'Eksport PDF',
        detailLevel: 'Poziom szczegółowości',
        simple: 'Podsumowanie',
        simpleDesc: 'Tylko łączne kwoty robocizny i materiałów - idealne dla klienta',
        standard: 'Dla klienta',
        standardDesc: 'Lista prac z kwotami, bez szczegółowych cen jednostkowych',
        detailed: 'Pełna specyfikacja',
        detailedDesc: 'Wszystkie pozycje z cenami jednostkowymi - do wewnętrznego użytku',
        download: 'Pobierz PDF',
        print: 'Drukuj kosztorys'
      },
      
      // Settings
      settings: {
        title: 'Ustawienia',
        companyName: 'Nazwa firmy',
        yourId: 'Twój ID',
        accountLink: 'Link do konta',
        saveLink: 'Zapisz ten link',
        copy: 'Kopiuj',
        copied: 'Skopiowano!',
        stats: 'Statystyki',
        tempAccount: 'Konto tymczasowe',
        tempAccountDesc: 'To konto demo zostanie automatycznie usunięte za',
        saveIdNote: 'Zapisz swój ID lub link, aby móc wrócić przed wygaśnięciem.',
        remaining: 'Pozostało:',
        language: 'Język',
        version: 'Wersja',
        dataLocal: 'Dane przechowywane lokalnie',
        retention: 'Retencja',
        phoneNumber: 'Numer telefonu',
        phonePlaceholder: '+48 123 456 789',
        companyInfo: 'Dane firmy',
        companyInfoDesc: 'Te dane pojawią się w stopce kosztorysów PDF',
        displayName: 'Nazwa wyświetlana',
        companyNameHint: 'Nazwa firmy widoczna w nagłówku i stopce kosztorysu PDF',
        phoneNumberHint: 'Numer kontaktowy wyświetlany w stopce kosztorysu - pozwala klientowi łatwo się z Tobą skontaktować'
      },
      
      // Validation
      validation: {
        requiredField: 'To pole jest wymagane',
        requiredFieldsInfo: 'Pola oznaczone * są wymagane',
        fillRequiredFields: 'Wypełnij wymagane pola, aby kontynuować'
      },
      
      // Units
      units: {
        mb: 'mb',
        m2: 'm²',
        szt: 'szt.',
        godz: 'godz.',
        kpl: 'kpl.',
        l: 'l',
        kg: 'kg'
      },
      
      // Room types
      roomTypes: {
        lazienka: 'Łazienka',
        kuchnia: 'Kuchnia',
        salon: 'Salon',
        sypialnia: 'Sypialnia',
        korytarz: 'Korytarz/Przedpokój',
        balkon: 'Balkon/Taras',
        dach_plaski: 'Dach płaski',
        dach_skosny: 'Dach skośny',
        inne: 'Inne'
      },
      
      // Sync
      sync: {
        offline: 'Offline',
        syncing: 'Synchronizacja...',
        pending: 'Oczekuje',
        error: 'Błąd synchronizacji',
        synced: 'Zsynchronizowano'
      },
      
      // Offline screen
      offline: {
        title: 'Brak połączenia',
        subtitle: 'Aplikacja wymaga dostępu do internetu',
        message: 'Aby korzystać z aplikacji, połącz się z internetem. Twoje dane są bezpieczne i zostaną zsynchronizowane po przywróceniu połączenia.',
        retry: 'Sprawdź połączenie',
        hint: 'Sprawdź ustawienia Wi-Fi lub danych mobilnych'
      }
    }
  },
  
  en: {
    translation: {
      appName: 'CostEstimatePro',
      appSubtitle: 'Professional estimates for renovation companies',
      
      nav: {
        estimates: 'Estimates',
        templates: 'Templates',
        settings: 'Settings'
      },
      
      common: {
        save: 'Save',
        cancel: 'Cancel',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search...',
        all: 'All',
        name: 'Name',
        price: 'Price',
        quantity: 'Quantity',
        unit: 'Unit',
        category: 'Category',
        description: 'Description',
        total: 'Total',
        labor: 'Labor',
        material: 'Material',
        materials: 'Materials',
        discount: 'Discount',
        noItems: 'No items',
        confirmDelete: 'Are you sure you want to delete?',
        createNew: '+ Create new',
        none: 'None',
        allCategories: 'All categories',
        quickAdd: 'Quick add',
        currency: '$',
        next: 'Next',
        back: 'Back',
        step: 'Step',
        of: 'of',
        notes: 'Notes',
        notesPlaceholder: 'Additional remarks, payment terms, deadlines...'
      },
      
      login: {
        companyName: 'Company name',
        companyPlaceholder: 'e.g. Best Renovations Ltd',
        newAccount: 'New account',
        existingAccount: 'I have an account',
        yourId: 'Your unique ID',
        idPlaceholder: 'e.g. a1b2c3d4',
        start: 'Start',
        login: 'Log in',
        accountType: 'Account type',
        withSampleData: 'With sample data',
        sampleDataDesc: 'Ready-made work and material templates',
        emptyAccount: 'Empty account',
        emptyAccountDesc: 'Start from scratch, add your own items',
        userNotFound: 'User not found or account expired',
        enterUsername: 'Enter company name',
        enterId: 'Enter user ID',
        demoNotice: 'Demo account - data is automatically deleted after {{hours}}h'
      },
      
      templates: {
        items: 'Items',
        works: 'Works',
        renovations: 'Renovations',
        itemTemplates: 'Item templates',
        workTemplates: 'Work templates',
        renovationTemplates: 'Renovation templates',
        newItem: 'New item',
        editItem: 'Edit item',
        newWork: 'New work template',
        editWork: 'Edit work template',
        newRenovation: 'New renovation template',
        editRenovation: 'Edit renovation template',
        workName: 'Work name',
        workNamePlaceholder: 'e.g. Wall painting',
        workUnit: 'Work unit',
        rooms: 'Rooms',
        roomsRequired: 'Enter work name and select at least one room',
        itemsInWork: 'Items in work',
        perUnit: 'per 1',
        selectItem: 'Select',
        selectWork: 'Select work...',
        addItems: 'Add items from the list below',
        saveTemplate: 'Save template',
        noMaterials: 'No materials',
        worksInTemplate: 'Works in template',
        roomType: 'Room type',
        templateName: 'Template name',
        templateNamePlaceholder: 'e.g. Full bathroom renovation',
        createItemFirst: 'Create an item first',
        createWorkFirst: 'Create a work first',
        orCreateNew: 'or create new',
        itemAlreadyAdded: 'This item is already added',
        workCategory: 'Work category'
      },
      
      estimates: {
        title: 'Estimates',
        new: 'New estimate',
        edit: 'Edit estimate',
        createFirst: 'Create first',
        clientData: 'Client data',
        clientName: 'Client name',
        clientNamePlaceholder: 'John Smith',
        clientAddress: 'Address',
        clientAddressPlaceholder: '123 Main St',
        projectDescription: 'Project description',
        projectDescriptionPlaceholder: 'Apartment renovation',
        options: 'Estimate options',
        includeMaterials: 'Include materials in estimate',
        laborDiscount: 'Labor discount (%)',
        materialDiscount: 'Material discount (%)',
        rooms: 'Rooms',
        addRoom: 'Add room',
        roomName: 'Room name',
        roomNamePlaceholder: 'e.g. Main bathroom',
        addWork: 'Add work',
        quickStart: 'Quick start:',
        noRooms: 'Add a room',
        noDescription: 'No description',
        confirmDeleteRoom: 'Delete room?',
        confirmDeleteEstimate: 'Delete estimate?',
        enterClientName: 'Enter client name',
        selectWork: 'Select work',
        workQuantity: 'Quantity',
        itemsToAdd: 'Items to add:',
        addWorkTitle: 'Add work',
        createWorkInline: 'Create new work',
        noEstimates: 'No estimates',
        wizardStep1Title: 'Client',
        wizardStep1Desc: 'Basic client and project information',
        wizardStep2Title: 'Rooms',
        wizardStep2Desc: 'Add rooms to renovate',
        wizardStep3Title: 'Works',
        wizardStep3Desc: 'Select works for each room',
        wizardStep4Title: 'Summary',
        wizardStep4Desc: 'Review and save estimate',
        selectRoomType: 'Select room type',
        selectRoomTypeHint: 'Room type determines available works',
        addFirstRoom: 'Add first room',
        addAnotherRoom: 'Add another room',
        noWorksInRoom: 'No works in this room',
        addWorksHint: 'Click "Add work" to add renovation works',
        useTemplate: 'Use template',
        applyTemplateHint: 'Ready-made set of works for this room type',
        discountsOptional: 'Discounts (optional)',
        notesOptional: 'Notes (optional)'
      },
      
      pdf: {
        export: 'PDF Export',
        detailLevel: 'Detail level',
        simple: 'Summary',
        simpleDesc: 'Only total amounts for labor and materials - ideal for client',
        standard: 'For client',
        standardDesc: 'List of works with amounts, without detailed unit prices',
        detailed: 'Full specification',
        detailedDesc: 'All items with unit prices - for internal use',
        download: 'Download PDF',
        print: 'Print estimate'
      },
      
      settings: {
        title: 'Settings',
        companyName: 'Company name',
        yourId: 'Your ID',
        accountLink: 'Account link',
        saveLink: 'Save this link',
        copy: 'Copy',
        copied: 'Copied!',
        stats: 'Statistics',
        tempAccount: 'Temporary account',
        tempAccountDesc: 'This demo account will be automatically deleted in',
        saveIdNote: 'Save your ID or link to return before expiration.',
        remaining: 'Remaining:',
        language: 'Language',
        version: 'Version',
        dataLocal: 'Data stored locally',
        retention: 'Retention',
        phoneNumber: 'Phone number',
        phonePlaceholder: '+1 123 456 7890',
        companyInfo: 'Company info',
        companyInfoDesc: 'This information will appear in PDF estimate footers',
        displayName: 'Display name',
        companyNameHint: 'Company name visible in PDF estimate header and footer',
        phoneNumberHint: 'Contact number displayed in estimate footer - allows clients to easily contact you'
      },
      
      validation: {
        requiredField: 'This field is required',
        requiredFieldsInfo: 'Fields marked with * are required',
        fillRequiredFields: 'Fill in required fields to continue'
      },
      
      units: {
        mb: 'lm',
        m2: 'm²',
        szt: 'pcs',
        godz: 'hrs',
        kpl: 'set',
        l: 'l',
        kg: 'kg'
      },
      
      roomTypes: {
        lazienka: 'Bathroom',
        kuchnia: 'Kitchen',
        salon: 'Living room',
        sypialnia: 'Bedroom',
        korytarz: 'Hallway',
        balkon: 'Balcony/Terrace',
        dach_plaski: 'Flat roof',
        dach_skosny: 'Sloped roof',
        inne: 'Other'
      },
      
      sync: {
        offline: 'Offline',
        syncing: 'Syncing...',
        pending: 'Pending',
        error: 'Sync error',
        synced: 'Synced'
      },
      
      offline: {
        title: 'No Connection',
        subtitle: 'This app requires internet access',
        message: 'To use the app, please connect to the internet. Your data is safe and will be synchronized once the connection is restored.',
        retry: 'Check Connection',
        hint: 'Check your Wi-Fi or mobile data settings'
      }
    }
  },
  
  de: {
    translation: {
      appName: 'KostenvoranschlagPro',
      appSubtitle: 'Professionelle Kostenvoranschläge für Renovierungsfirmen',
      
      nav: {
        estimates: 'Kostenvoranschläge',
        templates: 'Vorlagen',
        settings: 'Einstellungen'
      },
      
      common: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        add: 'Hinzufügen',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        search: 'Suchen...',
        all: 'Alle',
        name: 'Name',
        price: 'Preis',
        quantity: 'Menge',
        unit: 'Einheit',
        category: 'Kategorie',
        description: 'Beschreibung',
        total: 'Gesamt',
        labor: 'Arbeit',
        material: 'Material',
        materials: 'Materialien',
        discount: 'Rabatt',
        noItems: 'Keine Positionen',
        confirmDelete: 'Sind Sie sicher, dass Sie löschen möchten?',
        createNew: '+ Neu erstellen',
        none: 'Keine',
        allCategories: 'Alle Kategorien',
        quickAdd: 'Schnell hinzufügen',
        currency: '€'
      },
      
      login: {
        companyName: 'Firmenname',
        companyPlaceholder: 'z.B. Renovierungs GmbH',
        newAccount: 'Neues Konto',
        existingAccount: 'Ich habe ein Konto',
        yourId: 'Ihre eindeutige ID',
        idPlaceholder: 'z.B. a1b2c3d4',
        start: 'Starten',
        login: 'Anmelden',
        accountType: 'Kontotyp',
        withSampleData: 'Mit Beispieldaten',
        sampleDataDesc: 'Fertige Arbeits- und Materialvorlagen',
        emptyAccount: 'Leeres Konto',
        emptyAccountDesc: 'Von Grund auf neu beginnen',
        userNotFound: 'Benutzer nicht gefunden oder Konto abgelaufen',
        enterUsername: 'Firmennamen eingeben',
        enterId: 'Benutzer-ID eingeben',
        demoNotice: 'Demo-Konto - Daten werden nach {{hours}}h automatisch gelöscht'
      },
      
      templates: {
        items: 'Positionen',
        works: 'Arbeiten',
        renovations: 'Renovierungen',
        itemTemplates: 'Positionsvorlagen',
        workTemplates: 'Arbeitsvorlagen',
        renovationTemplates: 'Renovierungsvorlagen',
        newItem: 'Neue Position',
        editItem: 'Position bearbeiten',
        newWork: 'Neue Arbeitsvorlage',
        editWork: 'Arbeitsvorlage bearbeiten',
        newRenovation: 'Neue Renovierungsvorlage',
        editRenovation: 'Renovierungsvorlage bearbeiten',
        workName: 'Arbeitsname',
        workNamePlaceholder: 'z.B. Wände streichen',
        workUnit: 'Arbeitseinheit',
        rooms: 'Räume',
        roomsRequired: 'Geben Sie den Arbeitsnamen ein und wählen Sie mindestens einen Raum',
        itemsInWork: 'Positionen in der Arbeit',
        perUnit: 'pro 1',
        selectItem: 'Auswählen',
        selectWork: 'Arbeit auswählen...',
        addItems: 'Positionen aus der Liste unten hinzufügen',
        saveTemplate: 'Vorlage speichern',
        noMaterials: 'Keine Materialien',
        worksInTemplate: 'Arbeiten in der Vorlage',
        roomType: 'Raumtyp',
        templateName: 'Vorlagenname',
        templateNamePlaceholder: 'z.B. Komplette Badrenovierung',
        createItemFirst: 'Erstellen Sie zuerst eine Position',
        createWorkFirst: 'Erstellen Sie zuerst eine Arbeit',
        orCreateNew: 'oder neu erstellen',
        itemAlreadyAdded: 'Diese Position wurde bereits hinzugefügt',
        workCategory: 'Arbeitskategorie'
      },
      
      estimates: {
        title: 'Kostenvoranschläge',
        new: 'Neuer Kostenvoranschlag',
        edit: 'Kostenvoranschlag bearbeiten',
        createFirst: 'Ersten erstellen',
        clientData: 'Kundendaten',
        clientName: 'Kundenname',
        clientNamePlaceholder: 'Max Mustermann',
        clientAddress: 'Adresse',
        clientAddressPlaceholder: 'Hauptstraße 1',
        projectDescription: 'Projektbeschreibung',
        projectDescriptionPlaceholder: 'Wohnungsrenovierung',
        options: 'Optionen',
        includeMaterials: 'Materialien einbeziehen',
        laborDiscount: 'Arbeitsrabatt (%)',
        materialDiscount: 'Materialrabatt (%)',
        rooms: 'Räume',
        addRoom: 'Raum hinzufügen',
        roomName: 'Raumname',
        roomNamePlaceholder: 'z.B. Hauptbadezimmer',
        addWork: 'Arbeit hinzufügen',
        quickStart: 'Schnellstart:',
        noRooms: 'Raum hinzufügen',
        noDescription: 'Keine Beschreibung',
        confirmDeleteRoom: 'Raum löschen?',
        confirmDeleteEstimate: 'Kostenvoranschlag löschen?',
        enterClientName: 'Kundennamen eingeben',
        selectWork: 'Arbeit auswählen',
        workQuantity: 'Menge',
        itemsToAdd: 'Hinzuzufügende Positionen:',
        addWorkTitle: 'Arbeit hinzufügen',
        createWorkInline: 'Neue Arbeit erstellen',
        noEstimates: 'Keine Kostenvoranschläge'
      },
      
      pdf: {
        export: 'PDF-Export',
        detailLevel: 'Detailstufe',
        simple: 'Einfach',
        simpleDesc: 'Nur Zusammenfassung',
        standard: 'Standard',
        standardDesc: 'Positionsliste ohne Einzelpreise',
        detailed: 'Detailliert',
        detailedDesc: 'Vollständige Spezifikation mit Preisen',
        download: 'PDF herunterladen'
      },
      
      settings: {
        title: 'Einstellungen',
        companyName: 'Firmenname',
        yourId: 'Ihre ID',
        accountLink: 'Kontolink',
        saveLink: 'Diesen Link speichern',
        copy: 'Kopieren',
        copied: 'Kopiert!',
        stats: 'Statistiken',
        tempAccount: 'Temporäres Konto',
        tempAccountDesc: 'Dieses Demo-Konto wird automatisch gelöscht in',
        saveIdNote: 'Speichern Sie Ihre ID oder den Link, um vor Ablauf zurückzukehren.',
        remaining: 'Verbleibend:',
        language: 'Sprache',
        version: 'Version',
        dataLocal: 'Daten lokal gespeichert',
        retention: 'Aufbewahrung'
      },
      
      units: {
        mb: 'lfm',
        m2: 'm²',
        szt: 'Stk',
        godz: 'Std',
        kpl: 'Set',
        l: 'l',
        kg: 'kg'
      },
      
      roomTypes: {
        lazienka: 'Badezimmer',
        kuchnia: 'Küche',
        salon: 'Wohnzimmer',
        sypialnia: 'Schlafzimmer',
        korytarz: 'Flur',
        balkon: 'Balkon/Terrasse',
        dach_plaski: 'Flachdach',
        dach_skosny: 'Schrägdach',
        inne: 'Andere'
      },
      
      sync: {
        offline: 'Offline',
        syncing: 'Synchronisieren...',
        pending: 'Ausstehend',
        error: 'Sync-Fehler',
        synced: 'Synchronisiert'
      },
      
      offline: {
        title: 'Keine Verbindung',
        subtitle: 'Diese App erfordert Internetzugang',
        message: 'Um die App zu nutzen, verbinden Sie sich bitte mit dem Internet. Ihre Daten sind sicher und werden synchronisiert, sobald die Verbindung wiederhergestellt ist.',
        retry: 'Verbindung prüfen',
        hint: 'Überprüfen Sie Ihre WLAN- oder Mobilfunk-Einstellungen'
      }
    }
  },
  
  fr: {
    translation: {
      appName: 'DevisPro',
      appSubtitle: 'Devis professionnels pour entreprises de rénovation',
      
      nav: {
        estimates: 'Devis',
        templates: 'Modèles',
        settings: 'Paramètres'
      },
      
      common: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        search: 'Rechercher...',
        all: 'Tous',
        name: 'Nom',
        price: 'Prix',
        quantity: 'Quantité',
        unit: 'Unité',
        category: 'Catégorie',
        description: 'Description',
        total: 'Total',
        labor: 'Main-d\'œuvre',
        material: 'Matériel',
        materials: 'Matériaux',
        discount: 'Remise',
        noItems: 'Aucun élément',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer?',
        createNew: '+ Créer nouveau',
        none: 'Aucun',
        allCategories: 'Toutes les catégories',
        quickAdd: 'Ajout rapide',
        currency: '€'
      },
      
      login: {
        companyName: 'Nom de l\'entreprise',
        companyPlaceholder: 'ex. Rénovations Dupont',
        newAccount: 'Nouveau compte',
        existingAccount: 'J\'ai un compte',
        yourId: 'Votre identifiant unique',
        idPlaceholder: 'ex. a1b2c3d4',
        start: 'Commencer',
        login: 'Se connecter',
        accountType: 'Type de compte',
        withSampleData: 'Avec données d\'exemple',
        sampleDataDesc: 'Modèles de travaux et matériaux prêts',
        emptyAccount: 'Compte vide',
        emptyAccountDesc: 'Commencer de zéro',
        userNotFound: 'Utilisateur non trouvé ou compte expiré',
        enterUsername: 'Entrez le nom de l\'entreprise',
        enterId: 'Entrez l\'ID utilisateur',
        demoNotice: 'Compte démo - les données sont automatiquement supprimées après {{hours}}h'
      },
      
      templates: {
        items: 'Éléments',
        works: 'Travaux',
        renovations: 'Rénovations',
        itemTemplates: 'Modèles d\'éléments',
        workTemplates: 'Modèles de travaux',
        renovationTemplates: 'Modèles de rénovation',
        newItem: 'Nouvel élément',
        editItem: 'Modifier l\'élément',
        newWork: 'Nouveau modèle de travail',
        editWork: 'Modifier le modèle de travail',
        newRenovation: 'Nouveau modèle de rénovation',
        editRenovation: 'Modifier le modèle de rénovation',
        workName: 'Nom du travail',
        workNamePlaceholder: 'ex. Peinture des murs',
        workUnit: 'Unité de travail',
        rooms: 'Pièces',
        roomsRequired: 'Entrez le nom du travail et sélectionnez au moins une pièce',
        itemsInWork: 'Éléments dans le travail',
        perUnit: 'par 1',
        selectItem: 'Sélectionner',
        selectWork: 'Sélectionner un travail...',
        addItems: 'Ajouter des éléments de la liste ci-dessous',
        saveTemplate: 'Enregistrer le modèle',
        noMaterials: 'Pas de matériaux',
        worksInTemplate: 'Travaux dans le modèle',
        roomType: 'Type de pièce',
        templateName: 'Nom du modèle',
        templateNamePlaceholder: 'ex. Rénovation complète salle de bain',
        createItemFirst: 'Créez d\'abord un élément',
        createWorkFirst: 'Créez d\'abord un travail',
        orCreateNew: 'ou créer nouveau',
        itemAlreadyAdded: 'Cet élément a déjà été ajouté',
        workCategory: 'Catégorie de travail'
      },
      
      estimates: {
        title: 'Devis',
        new: 'Nouveau devis',
        edit: 'Modifier le devis',
        createFirst: 'Créer le premier',
        clientData: 'Données client',
        clientName: 'Nom du client',
        clientNamePlaceholder: 'Jean Dupont',
        clientAddress: 'Adresse',
        clientAddressPlaceholder: '1 rue Principale',
        projectDescription: 'Description du projet',
        projectDescriptionPlaceholder: 'Rénovation d\'appartement',
        options: 'Options du devis',
        includeMaterials: 'Inclure les matériaux',
        laborDiscount: 'Remise main-d\'œuvre (%)',
        materialDiscount: 'Remise matériaux (%)',
        rooms: 'Pièces',
        addRoom: 'Ajouter une pièce',
        roomName: 'Nom de la pièce',
        roomNamePlaceholder: 'ex. Salle de bain principale',
        addWork: 'Ajouter un travail',
        quickStart: 'Démarrage rapide:',
        noRooms: 'Ajouter une pièce',
        noDescription: 'Pas de description',
        confirmDeleteRoom: 'Supprimer la pièce?',
        confirmDeleteEstimate: 'Supprimer le devis?',
        enterClientName: 'Entrez le nom du client',
        selectWork: 'Sélectionner un travail',
        workQuantity: 'Quantité',
        itemsToAdd: 'Éléments à ajouter:',
        addWorkTitle: 'Ajouter un travail',
        createWorkInline: 'Créer nouveau travail',
        noEstimates: 'Aucun devis'
      },
      
      pdf: {
        export: 'Export PDF',
        detailLevel: 'Niveau de détail',
        simple: 'Simple',
        simpleDesc: 'Résumé uniquement',
        standard: 'Standard',
        standardDesc: 'Liste sans prix unitaires',
        detailed: 'Détaillé',
        detailedDesc: 'Spécification complète avec prix',
        download: 'Télécharger PDF'
      },
      
      settings: {
        title: 'Paramètres',
        companyName: 'Nom de l\'entreprise',
        yourId: 'Votre ID',
        accountLink: 'Lien du compte',
        saveLink: 'Enregistrez ce lien',
        copy: 'Copier',
        copied: 'Copié!',
        stats: 'Statistiques',
        tempAccount: 'Compte temporaire',
        tempAccountDesc: 'Ce compte démo sera automatiquement supprimé dans',
        saveIdNote: 'Enregistrez votre ID ou lien pour revenir avant expiration.',
        remaining: 'Restant:',
        language: 'Langue',
        version: 'Version',
        dataLocal: 'Données stockées localement',
        retention: 'Rétention'
      },
      
      units: {
        mb: 'ml',
        m2: 'm²',
        szt: 'pcs',
        godz: 'h',
        kpl: 'ens',
        l: 'l',
        kg: 'kg'
      },
      
      roomTypes: {
        lazienka: 'Salle de bain',
        kuchnia: 'Cuisine',
        salon: 'Salon',
        sypialnia: 'Chambre',
        korytarz: 'Couloir',
        balkon: 'Balcon/Terrasse',
        dach_plaski: 'Toit plat',
        dach_skosny: 'Toit en pente',
        inne: 'Autre'
      },
      
      sync: {
        offline: 'Hors ligne',
        syncing: 'Synchronisation...',
        pending: 'En attente',
        error: 'Erreur de sync',
        synced: 'Synchronisé'
      },
      
      offline: {
        title: 'Pas de connexion',
        subtitle: 'Cette application nécessite un accès Internet',
        message: 'Pour utiliser l\'application, veuillez vous connecter à Internet. Vos données sont en sécurité et seront synchronisées une fois la connexion rétablie.',
        retry: 'Vérifier la connexion',
        hint: 'Vérifiez vos paramètres Wi-Fi ou données mobiles'
      }
    }
  }
};

// Detect browser language
const getBrowserLanguage = (): string => {
  const stored = localStorage.getItem('kosztorys_language');
  if (stored && ['pl', 'en', 'de', 'fr'].includes(stored)) {
    return stored;
  }
  
  const browserLang = navigator.language.split('-')[0];
  return ['pl', 'en', 'de', 'fr'].includes(browserLang) ? browserLang : 'pl';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(),
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (lang: string) => {
  localStorage.setItem('kosztorys_language', lang);
  i18n.changeLanguage(lang);
};

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const SUPPORTED_LANGUAGES = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export default i18n;
