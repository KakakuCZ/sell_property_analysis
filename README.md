# 📊 Property Sale Analysis

> **⚠️ AI-Generated Application**: This application was generated using AI assistance to help with real estate investment analysis.

> **🔒 Privacy Notice**: This application runs entirely on your computer. **No data is sent anywhere**. All calculations and configurations remain completely private and anonymous on your local machine.

Desktop application for analyzing various property sale combinations built on Electron.

## ✨ Key Features

### 🏠 Property Management
- **Add properties**: Unlimited properties with name, value, sale price, and monthly rental income
- **Sale selection**: Checkboxes for each property to select which ones to sell
- **Sell all**: Quick checkbox to select/deselect all properties at once
- **Automatic discount**: Sale price recalculates based on quick sale discount

### 💰 Financial Analysis
- **Parameter configuration**: Listed price, discount, cash, mortgage rate, repayment period
- **Extra mortgage payments**: Plan extra payments in specific years
- **Automatic calculations**: Mortgage amount, monthly payments, interest
- **Growth parameters**: Configurable property and rent growth rates

### 📊 Visualization and Reporting
- **Detailed outputs**: Sale income, total cash, difference, mortgage needed
- **Cash flow chart**: Monthly payment, interest, and rental income trends over time
- **Wealth chart**: Total wealth development with/without payments and interest
- **Time projections**: 10-year outlook of property values and income
- **Interactive tooltips**: Help text for all inputs and outputs

### 💾 Save and Load
- **Export configuration**: Save all inputs to JSON file
- **Import configuration**: Quick load of saved scenarios
- **Cross-platform**: Works on macOS, Windows, and Linux

## 🚀 Installation and Running

### Requirements

- Node.js (version 16 or higher)
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Run Application

```bash
npm start
```

### Create Installation Package

```bash
# For macOS (Intel + Apple Silicon)
npm run build:mac

# For Windows (64-bit + 32-bit)
npm run build:win

# For Linux (AppImage + DEB)
npm run build:linux

# For all platforms at once
npm run build:all
```

The application will create installation files in the `dist/` folder:
- **macOS**: `.dmg` (disk image) and `.zip` archives
- **Windows**: `.exe` installer (NSIS) and portable version
- **Linux**: `.AppImage` and `.deb` packages for Ubuntu/Debian

## 📖 User Guide

### Step 1: Basic Parameters
1. Enter the **name of the property you want to buy** (e.g., "Downtown Apartment")
2. Fill in the **listed price** of the property
3. Enter **discount in %** or directly **price after discount** (linked)
4. Set the **quick sale discount** for your properties

### Step 2: Financial Parameters
1. Enter how much **cash** you have available
2. Set the **mortgage rate** and **repayment period**
3. Estimate **property price growth** and **rent growth** (typically 3%)

### Step 3: Extra Payments (optional)
1. Click **"+ Add extra payment"**
2. Enter the **year** when you'll make the payment
3. Enter the **amount** of the extra payment
4. You can add multiple extra payments

### Step 4: Properties
1. Click **"+ Add property"** for each property you own
2. Fill in **name**, **value**, **sale value**, and **monthly rental income**
3. **Check the checkbox** for properties you want to sell
4. Or use **"Sell all"** for quick selection

### Step 5: Calculate and Analyze
1. Click **"🔄 Calculate"**
2. Review **financial outputs** (mortgage, payments, interest)
3. Analyze **charts**:
   - **Chart 1**: Monthly cash flow (payments vs. rental income)
   - **Chart 2**: Total wealth development over time
4. Study the **development table** of values and income over 10 years

### Save and Load

- **💾 Save**: Save configuration to JSON file for later use
- **📁 Load**: Load saved configuration
- All inputs including extra payments are saved (checkboxes are not saved)

## 🛠️ Technologies

- **Electron** 27.x - Framework for cross-platform desktop applications
- **Node.js** - Runtime environment
- **Chart.js** 4.x - Library for interactive charts
- **HTML/CSS/JavaScript** - Frontend technologies
- **electron-builder** - For creating installation packages for all platforms

## 📝 Project Structure

```
sell_property_analysis/
├── main.js           # Main Electron process
├── preload.js        # Preload script for IPC communication
├── index.html        # HTML application structure
├── styles.css        # Application styles
├── renderer.js       # Application logic and calculations
├── package.json      # Node.js project configuration
└── README.md         # Documentation
```

## 💡 Tips and Tricks

- **Numbers with spaces**: All amounts are automatically formatted (1 000 000 CZK)
- **Linked inputs**: Discount and price after discount automatically recalculate
- **Tooltips**: Hover over blue **?** icons for help
- **Extra payments**: Reduce monthly payment and save on interest
- **Charts**: Red line above green = you're paying more than receiving from rent
- **Save scenarios**: Create multiple configurations for different situations
- **Cross-platform**: Application works the same on Mac, Windows, and Linux
- **Privacy-first**: All data stays on your computer, nothing is sent anywhere

## 🐛 Troubleshooting

If the application doesn't work:

1. Make sure you have Node.js installed
2. Delete the `node_modules` folder and run `npm install` again
3. Try restarting the application

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created for real estate investment analysis.

## 📧 Support

If you have problems or suggestions for improvements, please create an [Issue](https://github.com/KakakuCZ/sell_property_analysis/issues) on GitHub.
