# 📊 Analýza prodejů nemovitostí

Desktop aplikace pro analýzu různých kombinací prodejů nemovitostí postavená na Electron.

## ✨ Hlavní funkce

### 🏠 Správa nemovitostí
- **Přidávání nemovitostí**: Libovolný počet nemovitostí s názvem, hodnotou, prodejní cenou a příjmem z nájmu
- **Výběr k prodeji**: Checkboxy u každé nemovitosti pro výběr, které chcete prodat
- **Prodat vše**: Rychlé zaškrtnutí/odškrtnutí všech nemovitostí najednou
- **Automatický diskont**: Prodejní hodnota se přepočítá podle diskontu za rychlý prodej

### 💰 Finanční analýza
- **Konfigurace parametrů**: Inzerovaná cena, sleva, hotovost, úrok na hypotéce, doba splácení
- **Mimořádné splátky hypotéky**: Plánování mimořádných splátek v konkrétních letech
- **Automatický výpočet**: Výše hypotéky, měsíční splátky, úroky
- **Růstové parametry**: Nastavitelný růst cen nemovitostí a nájmů

### 📊 Vizualizace a reporting
- **Detailní výstupy**: Příjem z prodeje, celková hotovost, rozdíl, potřeba hypotéky
- **Graf cash flow**: Vývoj měsíčních splátek, úroků a příjmů z nájmu v čase
- **Graf majetku**: Vývoj celkového majetku s/bez splátek a úroků
- **Časové projekce**: 10letý výhled vývoje hodnot a příjmů
- **Interaktivní tooltipy**: Nápověda u všech vstupů a výstupů

### 💾 Ukládání a načítání
- **Export konfigurace**: Uložení všech vstupů do JSON souboru
- **Import konfigurace**: Rychlé načtení uložených scénářů
- **Cross-platform**: Funguje na macOS, Windows i Linux

## 🚀 Instalace a spuštění

### Požadavky

- Node.js (verze 16 nebo vyšší)
- npm nebo yarn

### Instalace závislostí

```bash
npm install
```

### Spuštění aplikace

```bash
npm start
```

### Vytvoření instalačního balíčku

```bash
# Pro macOS (Intel + Apple Silicon)
npm run build:mac

# Pro Windows (64-bit + 32-bit)
npm run build:win

# Pro Linux (AppImage + DEB)
npm run build:linux

# Pro všechny platformy najednou
npm run build:all
```

Aplikace vytvoří instalační soubory ve složce `dist/`:
- **macOS**: `.dmg` (disk image) a `.zip` archivy
- **Windows**: `.exe` instalátor (NSIS) a portable verze
- **Linux**: `.AppImage` a `.deb` balíčky pro Ubuntu/Debian

## 📖 Návod k použití

### Krok 1: Základní parametry
1. Zadejte **název kupované nemovitosti** (např. "Byt na Vinohradech")
2. Vyplňte **inzerovanou cenu** nemovitosti
3. Zadejte **slevu v %** nebo přímo **cenu po slevě** (provázané)
4. Nastavte **diskont za rychlý prodej** vašich nemovitostí

### Krok 2: Finanční parametry
1. Zadejte kolik máte **hotovosti** k dispozici
2. Nastavte **úrok na hypotéce** a **dobu splácení**
3. Odhadněte **růst cen nemovitostí** a **růst nájmů** (obvykle 3%)

### Krok 3: Mimořádné splátky (volitelné)
1. Klikněte na **"+ Přidat mimořádnou splátku"**
2. Zadejte **rok**, kdy splátku provedete
3. Zadejte **částku** mimořádné splátky
4. Můžete přidat více mimořádných splátek

### Krok 4: Nemovitosti
1. Klikněte na **"+ Přidat nemovitost"** pro každou vaši nemovitost
2. Vyplňte **název**, **hodnotu**, **prodejní hodnotu** a **měsíční příjem z nájmu**
3. **Zaškrtněte checkbox** u nemovitostí, které chcete prodat
4. Nebo použijte **"Prodat vše"** pro rychlý výběr

### Krok 5: Výpočet a analýza
1. Klikněte na **"🔄 Vypočítat"**
2. Prohlédněte si **finanční výstupy** (hypotéka, splátky, úroky)
3. Analyzujte **grafy**:
   - **Graf 1**: Měsíční cash flow (splátky vs. příjmy z nájmu)
   - **Graf 2**: Vývoj celkového majetku v čase
4. Prostudujte **tabulku vývoje** hodnot a příjmů po 10 let

### Ukládání a načítání

- **💾 Uložit**: Uložení konfigurace do JSON souboru pro pozdější použití
- **📁 Načíst**: Načtení uložené konfigurace
- Ukládají se všechny vstupy včetně mimořádných splátek (checkboxy se neuloží)

## 🛠️ Technologie

- **Electron** 27.x - Framework pro cross-platform desktop aplikace
- **Node.js** - Runtime prostředí
- **Chart.js** 4.x - Knihovna pro interaktivní grafy
- **HTML/CSS/JavaScript** - Frontend technologie
- **electron-builder** - Pro vytváření instalačních balíčků pro všechny platformy

## 📝 Struktura projektu

```
sell_property_analysis/
├── main.js           # Hlavní Electron proces
├── preload.js        # Preload script pro IPC komunikaci
├── index.html        # HTML struktura aplikace
├── styles.css        # Styly aplikace
├── renderer.js       # Logika aplikace a výpočty
├── package.json      # Konfigurace Node.js projektu
└── README.md         # Dokumentace
```

## 💡 Tipy a triky

- **Čísla s mezerami**: Všechny částky jsou automaticky formátované (1 000 000 Kč)
- **Provázané vstupy**: Sleva a cena po slevě se automaticky přepočítávají
- **Tooltips**: Najeďte myší na modré ikonky **?** pro nápovědu
- **Mimořádné splátky**: Sníží měsíční splátku a ušetříte na úrocích
- **Grafy**: Červená linka nad zelenou = platíte více než dostáváte z nájmu
- **Ukládejte scénáře**: Vytvořte si více konfigurací pro různé situace
- **Cross-platform**: Aplikace funguje stejně na Mac, Windows i Linux

## 🐛 Řešení problémů

Pokud aplikace nefunguje:

1. Ujistěte se, že máte nainstalovaný Node.js
2. Smažte složku `node_modules` a spusťte `npm install` znovu
3. Zkuste restartovat aplikaci

## 🤝 Přispívání

Přispění jsou vítána! Prosím:
1. Forkněte repozitář
2. Vytvořte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commitněte změny (`git commit -m 'Add some AmazingFeature'`)
4. Pushněte do branche (`git push origin feature/AmazingFeature`)
5. Otevřete Pull Request

## 📄 Licence

MIT License - viz [LICENSE](LICENSE) soubor pro detaily.

## 👨‍💻 Autor

Vytvořeno pro analýzu investic do nemovitostí.

## 📧 Podpora

Máte-li problémy nebo návrhy na vylepšení, vytvořte prosím [Issue](https://github.com/KakakuCZ/sell_property_analysis/issues) na GitHubu.


