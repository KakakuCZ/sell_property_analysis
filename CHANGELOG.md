# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- 📝 Updated README.md to English
- 🔒 Added privacy notice - all data stays local, nothing is sent anywhere
- ⚠️ Added AI-generated disclaimer
- 🗑️ Removed contributing section
- 🔧 Changed productName to English "Property Sale Analysis" (was using Czech characters)

### Fixed
- 🐛 Fixed macOS app not launching without error message
- 🔓 Disabled code signing for easier distribution (identity: null)
- 🛡️ Disabled hardened runtime and gatekeeper checks

## [1.0.0] - 2024-11-12

### Přidáno
- ✨ Základní struktura Electron aplikace
- 🏠 Správa nemovitostí - přidávání, odebírání, editace
- ☑️ Checkboxy pro výběr nemovitostí k prodeji
- ☑️ Checkbox "Prodat vše" pro hromadný výběr
- 💰 Konfigurace finančních parametrů (hotovost, úrok, doba splácení)
- 💸 Podpora mimořádných splátek hypotéky
- 📊 Graf vývoje měsíčních plateb a příjmů (Chart.js)
- 📈 Graf vývoje celkového majetku v čase
- 🔢 Automatické formátování čísel s mezerami jako oddělovači tisíců
- 💡 Interaktivní tooltips u všech vstupů a výstupů
- 📁 Ukládání a načítání konfigurace do/z JSON souboru
- 🔄 Automatické propojení inzerované ceny a slevy
- 📋 Detailní tabulka vývoje hodnot nemovitostí po 10 let
- 🧮 Výpočet hypotéky, měsíčních splátek a úroků
- 📐 Výpočet s mimořádnými splátkami (snížení měsíční splátky)
- 🎨 Moderní UI s gradientním designem
- 🌐 Cross-platform build konfigurace (macOS, Windows, Linux)

### Funkce
- Analýza různých variant prodeje nemovitostí
- Výpočet cash flow s ohledem na příjmy z nájmu
- Projekce růstu hodnoty nemovitostí a nájmů
- Přepočet prodejní hodnoty podle diskontu za rychlý prodej
- Simulace hypotéky měsíc po měsíci s mimořádnými splátkami
- Vizualizace dat pomocí interaktivních grafů
- Export/import scénářů pro snadné porovnávání

### Technické
- Electron 27.x jako základ aplikace
- Chart.js 4.x pro vizualizace
- electron-builder pro vytváření distribučních balíčků
- Responzivní design pro různé velikosti obrazovek
- IPC komunikace mezi main a renderer procesem
- Bezpečný preload script s contextIsolation

### Podporované platformy
- macOS (Intel x64 + Apple Silicon arm64)
- Windows (64-bit + 32-bit)
- Linux (Ubuntu/Debian - AppImage a DEB balíčky)

[1.0.0]: https://github.com/KakakuCZ/sell_property_analysis/releases/tag/v1.0.0

