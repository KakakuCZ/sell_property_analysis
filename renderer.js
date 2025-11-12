// Globální stav aplikace
let properties = [];
let propertyIdCounter = 0;
let extraPayments = [];
let extraPaymentIdCounter = 0;
let cashFlowChart = null;
let wealthChart = null;

// Formátování čísel
function formatCurrency(value) {
  return new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value) {
  return new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatNumberInput(value) {
  // Formátuje číslo s mezerami
  if (!value || value === '') return '';
  const num = parseFloat(String(value).replace(/\s/g, ''));
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('cs-CZ').format(num);
}

function parseFormattedNumber(value) {
  // Odstraní mezery a parsuje číslo
  if (!value || value === '') return 0;
  return parseFloat(String(value).replace(/\s/g, '')) || 0;
}

// Načtení elementů
const newPropertyNameInput = document.getElementById('newPropertyName');
const advertisedPriceInput = document.getElementById('advertisedPrice');
const discountInput = document.getElementById('discount');
const priceAfterDiscountInput = document.getElementById('priceAfterDiscount');
const quickSaleDiscountInput = document.getElementById('quickSaleDiscount');
const cashInput = document.getElementById('cash');
const mortgageRateInput = document.getElementById('mortgageRate');
const loanYearsInput = document.getElementById('loanYears');
const propertyGrowthInput = document.getElementById('propertyGrowth');
const rentGrowthInput = document.getElementById('rentGrowth');

const propertiesContainer = document.getElementById('propertiesContainer');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const extraPaymentsContainer = document.getElementById('extraPaymentsContainer');
const addExtraPaymentBtn = document.getElementById('addExtraPaymentBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');
const variantsContainer = document.getElementById('variantsContainer');
const sellAllCheckbox = document.getElementById('sellAllCheckbox');

const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');

// Automatické formátování pro všechna currency pole
function setupCurrencyInput(input) {
  input.addEventListener('blur', () => {
    const value = parseFormattedNumber(input.value);
    input.value = formatNumberInput(value);
  });
  
  input.addEventListener('focus', () => {
    const value = parseFormattedNumber(input.value);
    if (value === 0) {
      input.value = '';
    }
  });
}

// Nastavit formátování pro všechna currency pole
document.querySelectorAll('.currency-input').forEach(setupCurrencyInput);

// Propojení inzerované ceny a slevy
advertisedPriceInput.addEventListener('input', () => {
  const advertised = parseFormattedNumber(advertisedPriceInput.value);
  const discount = parseFloat(discountInput.value) || 0;
  const afterDiscount = advertised * (1 - discount / 100);
  priceAfterDiscountInput.value = formatNumberInput(Math.round(afterDiscount));
});

advertisedPriceInput.addEventListener('blur', () => {
  const advertised = parseFormattedNumber(advertisedPriceInput.value);
  const discount = parseFloat(discountInput.value) || 0;
  const afterDiscount = advertised * (1 - discount / 100);
  advertisedPriceInput.value = formatNumberInput(advertised);
  priceAfterDiscountInput.value = formatNumberInput(Math.round(afterDiscount));
});

discountInput.addEventListener('input', () => {
  const advertised = parseFormattedNumber(advertisedPriceInput.value);
  const discount = parseFloat(discountInput.value) || 0;
  const afterDiscount = advertised * (1 - discount / 100);
  priceAfterDiscountInput.value = formatNumberInput(Math.round(afterDiscount));
});

priceAfterDiscountInput.addEventListener('input', () => {
  const advertised = parseFormattedNumber(advertisedPriceInput.value);
  const afterDiscount = parseFormattedNumber(priceAfterDiscountInput.value);
  if (advertised > 0) {
    const discount = ((advertised - afterDiscount) / advertised) * 100;
    discountInput.value = discount.toFixed(2);
  }
});

priceAfterDiscountInput.addEventListener('blur', () => {
  const afterDiscount = parseFormattedNumber(priceAfterDiscountInput.value);
  priceAfterDiscountInput.value = formatNumberInput(afterDiscount);
});

// Správa mimořádných splátek
function addExtraPayment() {
  const extraPaymentId = extraPaymentIdCounter++;
  const extraPayment = {
    id: extraPaymentId,
    year: 1,
    amount: 0
  };
  
  extraPayments.push(extraPayment);
  renderExtraPayments();
}

function removeExtraPayment(extraPaymentId) {
  extraPayments = extraPayments.filter(ep => ep.id !== extraPaymentId);
  renderExtraPayments();
}

function updateExtraPayment(extraPaymentId, field, value) {
  const extraPayment = extraPayments.find(ep => ep.id === extraPaymentId);
  if (extraPayment) {
    extraPayment[field] = value;
  }
}

function updateExtraPaymentFromFormatted(extraPaymentId, field, formattedValue) {
  const value = parseFormattedNumber(formattedValue);
  updateExtraPayment(extraPaymentId, field, value);
}

function renderExtraPayments() {
  extraPaymentsContainer.innerHTML = '';
  
  if (extraPayments.length === 0) {
    extraPaymentsContainer.innerHTML = '<p style="color: #718096; font-size: 14px; font-style: italic;">Žádné mimořádné splátky</p>';
    return;
  }
  
  extraPayments.forEach(extraPayment => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.style.padding = '15px';
    
    card.innerHTML = `
      <div style="display: flex; gap: 15px; align-items: center;">
        <div class="input-group" style="flex: 1;">
          <label class="tooltip-container">
            Rok
            <span class="tooltip-icon">?
              <span class="tooltip-text">V jakém roce hypotéky provedete mimořádnou splátku</span>
            </span>
          </label>
          <input type="number" value="${extraPayment.year}" min="1" max="30" step="1"
                 onchange="updateExtraPayment(${extraPayment.id}, 'year', parseInt(this.value) || 1)"
                 style="padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 15px; background: #f7fafc;">
        </div>
        <div class="input-group" style="flex: 2;">
          <label class="tooltip-container">
            Částka (Kč)
            <span class="tooltip-icon">?
              <span class="tooltip-text long">Kolik peněz navíc zaplatíte na jistinu hypotéky. Sníží se měsíční splátka</span>
            </span>
          </label>
          <input type="text" value="${formatNumberInput(extraPayment.amount)}" class="currency-input"
                 onblur="updateExtraPaymentFromFormatted(${extraPayment.id}, 'amount', this.value); this.value = formatNumberInput(parseFormattedNumber(this.value));"
                 onfocus="if(parseFormattedNumber(this.value) === 0) this.value = '';"
                 style="padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 15px; background: #f7fafc;">
        </div>
        <button class="btn btn-danger" onclick="removeExtraPayment(${extraPayment.id})" style="margin-top: 24px;">🗑️</button>
      </div>
    `;
    
    extraPaymentsContainer.appendChild(card);
  });
}

// Správa nemovitostí
function addProperty() {
  const propertyId = propertyIdCounter++;
  const property = {
    id: propertyId,
    name: `Nemovitost ${propertyId + 1}`,
    value: 0,
    saleValue: 0,
    monthlyRent: 0,
    toSell: false  // checkbox stav - nezpůsobí problém se starou konfigurací
  };
  
  properties.push(property);
  renderProperties();
}

function removeProperty(propertyId) {
  properties = properties.filter(p => p.id !== propertyId);
  renderProperties();
}

function updateProperty(propertyId, field, value) {
  const property = properties.find(p => p.id === propertyId);
  if (property) {
    property[field] = value;
    
    // Aktualizovat prodejní hodnotu pokud se změní diskont
    if (field === 'value') {
      const quickDiscount = parseFloat(quickSaleDiscountInput.value) || 0;
      property.saleValue = property.value * (1 - quickDiscount / 100);
      renderProperties();
    }
  }
}

function togglePropertySale(propertyId, checked) {
  const property = properties.find(p => p.id === propertyId);
  if (property) {
    property.toSell = checked;
  }
  updateSellAllCheckbox();
}

function updateSellAllCheckbox() {
  // Aktualizovat stav "Prodat vše" checkboxu podle jednotlivých nemovitostí
  const allChecked = properties.length > 0 && properties.every(p => p.toSell === true);
  const someChecked = properties.some(p => p.toSell === true);
  
  sellAllCheckbox.checked = allChecked;
  sellAllCheckbox.indeterminate = !allChecked && someChecked;
}

function toggleSellAll(checked) {
  properties.forEach(p => {
    p.toSell = checked;
  });
  renderProperties();
}

function renderProperties() {
  propertiesContainer.innerHTML = '';
  
  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    const quickDiscount = parseFloat(quickSaleDiscountInput.value) || 0;
    const calculatedDiscount = property.value > 0 
      ? ((property.value - property.saleValue) / property.value * 100)
      : 0;
    
    // Zajistit že toSell existuje (kvůli kompatibilitě se starou konfigurací)
    if (property.toSell === undefined) {
      property.toSell = false;
    }
    
    card.innerHTML = `
      <div class="property-header">
        <div style="display: flex; align-items: center; gap: 15px;">
          <label class="tooltip-container" style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
            <input type="checkbox" ${property.toSell ? 'checked' : ''} 
                   onchange="togglePropertySale(${property.id}, this.checked)"
                   style="width: 18px; height: 18px; cursor: pointer;">
            <span style="color: #48bb78;">✓ Prodat tuto nemovitost</span>
            <span class="tooltip-icon">?
              <span class="tooltip-text long">Zahrne tuto nemovitost do výpočtu jako prodanou pro získání hotovosti</span>
            </span>
          </label>
          <h3 style="margin: 0;">${property.name}</h3>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeProperty(${property.id})">🗑️ Odstranit</button>
      </div>
      <div class="property-inputs">
        <div class="input-group">
          <label>Název</label>
          <input type="text" value="${property.name}" 
                 onchange="updateProperty(${property.id}, 'name', this.value)">
        </div>
        <div class="input-group">
          <label class="tooltip-container">
            Hodnota (Kč)
            <span class="tooltip-icon">?
              <span class="tooltip-text">Skutečná tržní hodnota nemovitosti</span>
            </span>
          </label>
          <input type="text" value="${formatNumberInput(property.value)}" class="currency-input" data-property-id="${property.id}" data-field="value"
                 onblur="updatePropertyFromFormatted(${property.id}, 'value', this.value); this.value = formatNumberInput(parseFormattedNumber(this.value));"
                 onfocus="if(parseFormattedNumber(this.value) === 0) this.value = '';">
        </div>
        <div class="input-group">
          <label class="tooltip-container">
            Prodejní hodnota (Kč)
            <span class="tooltip-icon">?
              <span class="tooltip-text long">Za kolik reálně prodáte při rychlém prodeji (hodnota - diskont)</span>
            </span>
          </label>
          <input type="text" value="${formatNumberInput(property.saleValue)}" class="currency-input" data-property-id="${property.id}" data-field="saleValue"
                 onblur="updatePropertyFromFormatted(${property.id}, 'saleValue', this.value); this.value = formatNumberInput(parseFormattedNumber(this.value));"
                 onfocus="if(parseFormattedNumber(this.value) === 0) this.value = '';">
        </div>
        <div class="input-group">
          <label class="tooltip-container">
            Měsíční příjem z nájmu (Kč)
            <span class="tooltip-icon">?
              <span class="tooltip-text long">Kolik dostáváte měsíčně od nájemníků. Ovlivňuje cash flow</span>
            </span>
          </label>
          <input type="text" value="${formatNumberInput(property.monthlyRent)}" class="currency-input" data-property-id="${property.id}" data-field="monthlyRent"
                 onblur="updatePropertyFromFormatted(${property.id}, 'monthlyRent', this.value); this.value = formatNumberInput(parseFormattedNumber(this.value));"
                 onfocus="if(parseFormattedNumber(this.value) === 0) this.value = '';">
        </div>
        <div class="input-group">
          <label class="tooltip-container">
            Diskont (%)
            <span class="tooltip-icon">?
              <span class="tooltip-text long">Automaticky vypočítaný rozdíl mezi hodnotou a prodejní cenou</span>
            </span>
          </label>
          <input type="text" value="${formatPercent(calculatedDiscount)} %" readonly 
                 style="background: #e2e8f0; cursor: not-allowed;">
        </div>
      </div>
    `;
    
    propertiesContainer.appendChild(card);
  });
}

function updatePropertyFromFormatted(propertyId, field, formattedValue) {
  const value = parseFormattedNumber(formattedValue);
  updateProperty(propertyId, field, value);
}

// Aktualizovat prodejní hodnoty při změně diskontu
quickSaleDiscountInput.addEventListener('input', () => {
  const quickDiscount = parseFloat(quickSaleDiscountInput.value) || 0;
  properties.forEach(property => {
    property.saleValue = Math.round(property.value * (1 - quickDiscount / 100));
  });
  renderProperties();
});

// Výpočetní funkce
function calculateMortgage(principal, annualRate, years) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return {
      monthlyPayment: 0,
      monthlyInterest: 0,
      annualInterest: 0
    };
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const annualInterest = principal * (annualRate / 100);
  const monthlyInterest = annualInterest / 12;
  
  return {
    monthlyPayment: monthlyPayment,
    monthlyInterest: monthlyInterest,
    annualInterest: annualInterest
  };
}

// Výpočet hypotéky s mimořádnými splátkami po jednotlivých letech
function calculateMortgageSchedule(principal, annualRate, years, extraPaymentsList) {
  const schedule = [];
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  
  let remainingPrincipal = principal;
  let currentMonthlyPayment = 0;
  
  if (principal > 0 && annualRate > 0 && years > 0) {
    currentMonthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
  
  // Seřadit mimořádné splátky podle roku
  const sortedExtraPayments = [...extraPaymentsList].sort((a, b) => a.year - b.year);
  
  for (let year = 1; year <= 10; year++) {
    let yearData = {
      year: year,
      startingPrincipal: remainingPrincipal,
      monthlyPayment: currentMonthlyPayment,
      totalPayments: 0,
      totalInterest: 0,
      extraPayment: 0,
      endingPrincipal: remainingPrincipal
    };
    
    if (remainingPrincipal <= 0) {
      yearData.monthlyPayment = 0;
      yearData.totalPayments = 0;
      yearData.totalInterest = 0;
      schedule.push(yearData);
      continue;
    }
    
    // Simulace měsíčních splátek po celý rok
    let yearlyInterest = 0;
    let yearlyPayments = 0;
    
    for (let month = 1; month <= 12; month++) {
      if (remainingPrincipal <= 0) break;
      
      const monthlyInterest = remainingPrincipal * monthlyRate;
      const principalPayment = Math.min(currentMonthlyPayment - monthlyInterest, remainingPrincipal);
      
      yearlyInterest += monthlyInterest;
      yearlyPayments += monthlyInterest + principalPayment;
      remainingPrincipal -= principalPayment;
      
      if (remainingPrincipal < 0) remainingPrincipal = 0;
    }
    
    yearData.totalPayments = yearlyPayments;
    yearData.totalInterest = yearlyInterest;
    
    // Aplikovat mimořádnou splátku na konci roku
    const extraPayment = sortedExtraPayments.find(ep => ep.year === year);
    if (extraPayment && extraPayment.amount > 0 && remainingPrincipal > 0) {
      const actualExtraPayment = Math.min(extraPayment.amount, remainingPrincipal);
      remainingPrincipal -= actualExtraPayment;
      yearData.extraPayment = actualExtraPayment;
      yearData.totalPayments += actualExtraPayment;
      
      if (remainingPrincipal < 0) remainingPrincipal = 0;
      
      // Přepočítat měsíční splátku na základě zbývající jistiny
      if (remainingPrincipal > 0) {
        const remainingYears = years - year;
        const remainingMonths = remainingYears * 12;
        if (remainingMonths > 0) {
          currentMonthlyPayment = remainingPrincipal * 
            (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
            (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        }
      } else {
        currentMonthlyPayment = 0;
      }
    }
    
    yearData.endingPrincipal = remainingPrincipal;
    schedule.push(yearData);
  }
  
  return schedule;
}

function generateVariant() {
  // Vygeneruje jednu variantu na základě zaškrtnutých checkboxů
  const newPropertyName = newPropertyNameInput.value || 'Nová nemovitost';
  
  const soldProperties = properties.filter(p => p.toSell === true);
  const keptProperties = properties.filter(p => p.toSell !== true);
  
  let variantName;
  if (soldProperties.length === 0) {
    variantName = `${newPropertyName} (bez prodeje nemovitostí)`;
  } else if (soldProperties.length === 1) {
    variantName = `${newPropertyName} (prodej: ${soldProperties[0].name})`;
  } else {
    const soldNames = soldProperties.map(p => p.name).join(' + ');
    variantName = `${newPropertyName} (prodej: ${soldNames})`;
  }
  
  return {
    name: variantName,
    soldProperties: soldProperties,
    keptProperties: keptProperties
  };
}

function calculateVariant(variant) {
  const priceAfterDiscount = parseFormattedNumber(priceAfterDiscountInput.value);
  const cash = parseFormattedNumber(cashInput.value);
  const mortgageRate = parseFloat(mortgageRateInput.value) || 0;
  const loanYears = parseInt(loanYearsInput.value) || 20;
  
  // Příjem z prodeje nemovitostí
  const saleIncome = variant.soldProperties.reduce((sum, p) => sum + p.saleValue, 0);
  
  // Celková hotovost
  const totalCash = cash + saleIncome;
  
  // Rozdíl (co zbyde po koupi)
  const difference = totalCash - priceAfterDiscount;
  
  // Hypotéka
  let mortgageNeeded = 0;
  let mortgage = { monthlyPayment: 0, monthlyInterest: 0, annualInterest: 0 };
  let mortgageSchedule = [];
  
  if (difference < 0) {
    mortgageNeeded = Math.abs(difference);
    mortgage = calculateMortgage(mortgageNeeded, mortgageRate, loanYears);
    mortgageSchedule = calculateMortgageSchedule(mortgageNeeded, mortgageRate, loanYears, extraPayments);
  } else {
    // Žádná hypotéka, prázdný schedule
    for (let year = 1; year <= 10; year++) {
      mortgageSchedule.push({
        year: year,
        startingPrincipal: 0,
        monthlyPayment: 0,
        totalPayments: 0,
        totalInterest: 0,
        extraPayment: 0,
        endingPrincipal: 0
      });
    }
  }
  
  return {
    ...variant,
    saleIncome,
    totalCash,
    difference,
    mortgageNeeded,
    mortgage,
    mortgageSchedule
  };
}

function generateTimeline(variant) {
  const propertyGrowth = parseFloat(propertyGrowthInput.value) || 0;
  const rentGrowth = parseFloat(rentGrowthInput.value) || 0;
  const years = 10;
  
  const timeline = [];
  
  for (let year = 1; year <= years; year++) {
    const yearData = {
      year: year,
      properties: []
    };
    
    // Pro každou zachovanou nemovitost
    variant.keptProperties.forEach(property => {
      const propertyValue = property.value * Math.pow(1 + propertyGrowth / 100, year);
      const monthlyRent = property.monthlyRent * Math.pow(1 + rentGrowth / 100, year);
      const annualRent = monthlyRent * 12;
      const cumulativeRent = property.monthlyRent * 12 * 
        ((Math.pow(1 + rentGrowth / 100, year) - 1) / (rentGrowth / 100));
      
      yearData.properties.push({
        name: property.name,
        value: propertyValue,
        monthlyRent: monthlyRent,
        annualRent: annualRent,
        cumulativeRent: rentGrowth === 0 ? annualRent * year : cumulativeRent
      });
    });
    
    // Také nová nemovitost
    const priceAfterDiscount = parseFormattedNumber(priceAfterDiscountInput.value);
    const newPropertyValue = priceAfterDiscount * Math.pow(1 + propertyGrowth / 100, year);
    
    yearData.newProperty = {
      name: newPropertyNameInput.value || 'Nová nemovitost',
      value: newPropertyValue
    };
    
    // Celkové hodnoty
    yearData.totalPropertyValue = yearData.properties.reduce((sum, p) => sum + p.value, 0) + 
                                   yearData.newProperty.value;
    yearData.totalCumulativeRent = yearData.properties.reduce((sum, p) => sum + p.cumulativeRent, 0);
    
    timeline.push(yearData);
  }
  
  return timeline;
}

function renderResults(calculatedVariant) {
  variantsContainer.innerHTML = '';
  
  const card = document.createElement('div');
  card.className = 'variant-card';
  
  const timeline = generateTimeline(calculatedVariant);
  
  card.innerHTML = `
    <h3>${calculatedVariant.name}</h3>
    
    <div class="variant-summary">
      <div class="summary-item">
        <label class="tooltip-container">
          Příjem z prodeje
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Kolik peněz získáte prodejem zaškrtnutých nemovitostí</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.saleIncome)} Kč</div>
      </div>
      <div class="summary-item">
        <label class="tooltip-container">
          Hotovost
          <span class="tooltip-icon">?
            <span class="tooltip-text">Vaše vlastní peníze na začátku</span>
          </span>
        </label>
        <div class="value">${formatCurrency(parseFormattedNumber(cashInput.value))} Kč</div>
      </div>
      <div class="summary-item highlight">
        <label class="tooltip-container">
          Celkem
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Celková částka k dispozici (hotovost + příjem z prodeje)</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.totalCash)} Kč</div>
      </div>
      <div class="summary-item ${calculatedVariant.difference >= 0 ? 'highlight' : 'negative'}">
        <label class="tooltip-container">
          Rozdíl
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Co vám zbyde/chybí po koupi. Záporné = musíte vzít hypotéku</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.difference)} Kč</div>
      </div>
      <div class="summary-item ${calculatedVariant.mortgageNeeded > 0 ? 'negative' : ''}">
        <label class="tooltip-container">
          Hypotéka
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Kolik si musíte půjčit od banky (jistina hypotéky)</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.mortgageNeeded)} Kč</div>
      </div>
      <div class="summary-item">
        <label class="tooltip-container">
          Roční úrok
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Kolik zaplatíte bance ročně na úrocích (první rok)</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.mortgage.annualInterest)} Kč</div>
      </div>
      <div class="summary-item">
        <label class="tooltip-container">
          Měsíční úrok
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Kolik z měsíční splátky je úrok (klesá s časem)</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.mortgage.monthlyInterest)} Kč</div>
      </div>
      <div class="summary-item">
        <label class="tooltip-container">
          Splátka (měsíční)
          <span class="tooltip-icon">?
            <span class="tooltip-text long">Kolik celkem platíte bance každý měsíc (úrok + jistina)</span>
          </span>
        </label>
        <div class="value">${formatCurrency(calculatedVariant.mortgage.monthlyPayment)} Kč</div>
      </div>
    </div>
    
    <h4 style="margin-top: 20px; margin-bottom: 10px; font-size: 16px; color: #2d3748;">
      Vývoj po letech
    </h4>
    
    <table class="timeline-table">
      <thead>
        <tr>
          <th>Rok</th>
          ${calculatedVariant.keptProperties.map(p => `
            <th colspan="2">${p.name}</th>
          `).join('')}
          <th colspan="1">${newPropertyNameInput.value || 'Nová nemovitost'}</th>
          <th>Celková hodnota</th>
          <th>Kumulativní příjem</th>
        </tr>
        <tr>
          <th></th>
          ${calculatedVariant.keptProperties.map(() => `
            <th>Hodnota</th>
            <th>Příjem (kum.)</th>
          `).join('')}
          <th>Hodnota</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${timeline.map(year => `
          <tr>
            <td>${year.year}</td>
            ${calculatedVariant.keptProperties.map((p, idx) => {
              const propData = year.properties[idx];
              return `
                <td>${formatCurrency(propData.value)} Kč</td>
                <td>${formatCurrency(propData.cumulativeRent)} Kč</td>
              `;
            }).join('')}
            <td>${formatCurrency(year.newProperty.value)} Kč</td>
            <td><strong>${formatCurrency(year.totalPropertyValue)} Kč</strong></td>
            <td><strong>${formatCurrency(year.totalCumulativeRent)} Kč</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  variantsContainer.appendChild(card);
  
  // Vykreslit grafy
  renderCashFlowChart(calculatedVariant);
  renderWealthChart(calculatedVariant);
  
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderCashFlowChart(variant) {
  const rentGrowth = parseFloat(rentGrowthInput.value) || 0;
  const years = 10;
  
  // Příprava dat
  const labels = [];
  const monthlyPaymentData = [];
  const monthlyInterestData = [];
  const monthlyRentData = [];
  
  for (let year = 1; year <= years; year++) {
    labels.push(`Rok ${year}`);
    
    // Měsíční splátka a úrok z mortgage schedule (zohledňuje mimořádné splátky)
    const scheduleYear = variant.mortgageSchedule[year - 1];
    monthlyPaymentData.push(scheduleYear.monthlyPayment);
    
    const monthlyInterest = scheduleYear.totalInterest / 12;
    monthlyInterestData.push(monthlyInterest);
    
    // Měsíční příjem z nájmu roste každý rok
    const totalMonthlyRent = variant.keptProperties.reduce((sum, property) => {
      const rentThisYear = property.monthlyRent * Math.pow(1 + rentGrowth / 100, year);
      return sum + rentThisYear;
    }, 0);
    
    monthlyRentData.push(totalMonthlyRent);
  }
  
  // Zničit starý graf pokud existuje
  if (cashFlowChart) {
    cashFlowChart.destroy();
  }
  
  // Vytvořit nový graf
  const ctx = document.getElementById('cashFlowChart').getContext('2d');
  cashFlowChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Měsíční splátka',
          data: monthlyPaymentData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Měsíční úrok',
          data: monthlyInterestData,
          borderColor: 'rgb(251, 146, 60)',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Měsíční příjem z nájmu',
          data: monthlyRentData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 13,
              weight: '600'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.parsed.y) + ' Kč';
              return label;
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value) + ' Kč';
            },
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function renderWealthChart(variant) {
  const propertyGrowth = parseFloat(propertyGrowthInput.value) || 0;
  const rentGrowth = parseFloat(rentGrowthInput.value) || 0;
  const priceAfterDiscount = parseFormattedNumber(priceAfterDiscountInput.value);
  const years = 10;
  
  // Příprava dat
  const labels = [];
  const wealthWithPaymentsData = [];  // Majetek mínus splátky
  const wealthWithInterestData = [];   // Majetek mínus úroky
  
  let cumulativePayments = 0;
  let cumulativeInterest = 0;
  
  for (let year = 1; year <= years; year++) {
    labels.push(`Rok ${year}`);
    
    // Hodnota zachovaných nemovitostí
    const keptPropertiesValue = variant.keptProperties.reduce((sum, property) => {
      return sum + property.value * Math.pow(1 + propertyGrowth / 100, year);
    }, 0);
    
    // Hodnota nové nemovitosti
    const newPropertyValue = priceAfterDiscount * Math.pow(1 + propertyGrowth / 100, year);
    
    // Kumulativní příjem z nájmu
    let cumulativeRent = 0;
    variant.keptProperties.forEach(property => {
      if (rentGrowth === 0) {
        cumulativeRent += property.monthlyRent * 12 * year;
      } else {
        cumulativeRent += property.monthlyRent * 12 * 
          ((Math.pow(1 + rentGrowth / 100, year) - 1) / (rentGrowth / 100));
      }
    });
    
    // Kumulativní splátky a úroky z mortgage schedule (zohledňuje mimořádné splátky)
    const scheduleYear = variant.mortgageSchedule[year - 1];
    cumulativePayments += scheduleYear.totalPayments;
    cumulativeInterest += scheduleYear.totalInterest;
    
    // Celkový majetek = hodnota nemovitostí + kumulativní příjem - splátky/úroky
    const totalPropertyValue = keptPropertiesValue + newPropertyValue;
    const wealthWithPayments = totalPropertyValue + cumulativeRent - cumulativePayments;
    const wealthWithInterest = totalPropertyValue + cumulativeRent - cumulativeInterest;
    
    wealthWithPaymentsData.push(wealthWithPayments);
    wealthWithInterestData.push(wealthWithInterest);
  }
  
  // Zničit starý graf pokud existuje
  if (wealthChart) {
    wealthChart.destroy();
  }
  
  // Vytvořit nový graf
  const ctx = document.getElementById('wealthChart').getContext('2d');
  wealthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Majetek (mínus splátky)',
          data: wealthWithPaymentsData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true
        },
        {
          label: 'Majetek (mínus úroky)',
          data: wealthWithInterestData,
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 13,
              weight: '600'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.parsed.y) + ' Kč';
              return label;
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return formatCurrency(value) + ' Kč';
            },
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Hlavní výpočet
calculateBtn.addEventListener('click', () => {
  if (properties.length === 0) {
    alert('Přidejte alespoň jednu nemovitost.');
    return;
  }
  
  const variant = generateVariant();
  const calculatedVariant = calculateVariant(variant);
  renderResults(calculatedVariant);
});

// Ukládání a načítání
saveBtn.addEventListener('click', async () => {
  // Odstranit toSell z properties před uložením (není součástí konfigurace)
  const propertiesForSave = properties.map(p => {
    const { toSell, ...propertyWithoutToSell } = p;
    return propertyWithoutToSell;
  });
  
  const data = {
    newPropertyName: newPropertyNameInput.value,
    advertisedPrice: advertisedPriceInput.value,
    discount: discountInput.value,
    priceAfterDiscount: priceAfterDiscountInput.value,
    quickSaleDiscount: quickSaleDiscountInput.value,
    cash: cashInput.value,
    mortgageRate: mortgageRateInput.value,
    loanYears: loanYearsInput.value,
    propertyGrowth: propertyGrowthInput.value,
    rentGrowth: rentGrowthInput.value,
    properties: propertiesForSave,
    extraPayments: extraPayments  // Mimořádné splátky JSOU součástí konfigurace
  };
  
  const result = await window.electronAPI.saveData(data);
  
  if (result.success) {
    alert('Konfigurace byla úspěšně uložena.');
  } else if (!result.canceled) {
    alert('Chyba při ukládání: ' + (result.error || 'Neznámá chyba'));
  }
});

loadBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.loadData();
  
  if (result.success) {
    const data = result.data;
    
    newPropertyNameInput.value = data.newPropertyName || 'Nová nemovitost';
    advertisedPriceInput.value = formatNumberInput(parseFormattedNumber(data.advertisedPrice || 0));
    discountInput.value = data.discount || 0;
    priceAfterDiscountInput.value = formatNumberInput(parseFormattedNumber(data.priceAfterDiscount || 0));
    quickSaleDiscountInput.value = data.quickSaleDiscount || 0;
    cashInput.value = formatNumberInput(parseFormattedNumber(data.cash || 0));
    mortgageRateInput.value = data.mortgageRate || 5;
    loanYearsInput.value = data.loanYears || 20;
    propertyGrowthInput.value = data.propertyGrowth || 3;
    rentGrowthInput.value = data.rentGrowth || 3;
    
    properties = data.properties || [];
    
    // Zajistit že všechny nemovitosti mají toSell = false (není součástí uložené konfigurace)
    properties.forEach(p => {
      p.toSell = false;
    });
    
    propertyIdCounter = properties.length > 0 
      ? Math.max(...properties.map(p => p.id)) + 1 
      : 0;
    
    // Načíst mimořádné splátky
    extraPayments = data.extraPayments || [];
    extraPaymentIdCounter = extraPayments.length > 0 
      ? Math.max(...extraPayments.map(ep => ep.id)) + 1 
      : 0;
    
    renderProperties();
    renderExtraPayments();
    
    alert('Konfigurace byla úspěšně načtena.');
  } else if (!result.canceled) {
    alert('Chyba při načítání: ' + (result.error || 'Neznámá chyba'));
  }
});

// Event listenery pro tlačítka
addPropertyBtn.addEventListener('click', addProperty);
addExtraPaymentBtn.addEventListener('click', addExtraPayment);

// Checkbox "Prodat vše"
sellAllCheckbox.addEventListener('change', (e) => {
  toggleSellAll(e.target.checked);
});

// Přidat jednu výchozí nemovitost při načtení
addProperty();
renderExtraPayments();

