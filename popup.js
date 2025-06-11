class CryptoConverter {
    constructor() {
        this.rates = {};
        this.cryptoPrices = {};
        this.isLoading = false;
        this.lastUpdate = null;
        
        this.initElements();
        this.bindEvents();
        this.loadData();
        this.startAutoUpdate();
    }

    initElements() {
        this.fromAmount = document.getElementById('fromAmount');
        this.toAmount = document.getElementById('toAmount');
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.swapBtn = document.getElementById('swapBtn');
        this.rateDisplay = document.getElementById('rateDisplay');
        this.lastUpdated = document.getElementById('lastUpdated');
        this.loadingSpinner = document.getElementById('loadingSpinner');
    }

    bindEvents() {
        this.fromAmount.addEventListener('input', () => this.convert());
        this.fromCurrency.addEventListener('change', () => this.convert());
        this.toCurrency.addEventListener('change', () => this.convert());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());

        // Crypto card click events
        document.querySelectorAll('.crypto-card').forEach(card => {
            card.addEventListener('click', () => {
                const crypto = card.dataset.crypto;
                this.toCurrency.value = crypto;
                this.convert();
                this.animateCard(card);
            });
        });
    }

    async loadData() {
        this.showLoading(true);
        try {
            await Promise.all([
                this.fetchCryptoPrices(),
                this.fetchExchangeRates()
            ]);
            this.convert();
            this.updateLastUpdated();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError();
        }
        this.showLoading(false);
    }

    async fetchCryptoPrices() {
        try {
            const cryptos = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'polkadot', 'polygon'];
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=usd&include_24hr_change=true`
            );
            
            if (!response.ok) throw new Error('Failed to fetch crypto prices');
            
            const data = await response.json();
            
            // Map API response to our format
            this.cryptoPrices = {
                BTC: { price: data.bitcoin?.usd || 0, change: data.bitcoin?.usd_24h_change || 0 },
                ETH: { price: data.ethereum?.usd || 0, change: data.ethereum?.usd_24h_change || 0 },
                BNB: { price: data.binancecoin?.usd || 0, change: data.binancecoin?.usd_24h_change || 0 },
                ADA: { price: data.cardano?.usd || 0, change: data.cardano?.usd_24h_change || 0 },
                SOL: { price: data.solana?.usd || 0, change: data.solana?.usd_24h_change || 0 },
                DOT: { price: data.polkadot?.usd || 0, change: data.polkadot?.usd_24h_change || 0 },
                MATIC: { price: data.polygon?.usd || 0, change: data.polygon?.usd_24h_change || 0 }
            };

            this.updateCryptoCards();
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            // Fallback prices
            this.cryptoPrices = {
                BTC: { price: 45000, change: 2.5 },
                ETH: { price: 3000, change: 1.8 },
                BNB: { price: 300, change: -0.5 }
            };
        }
    }

    async fetchExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            if (!response.ok) throw new Error('Failed to fetch exchange rates');
            
            const data = await response.json();
            this.rates = { USD: 1, ...data.rates };
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            // Fallback rates
            this.rates = {
                USD: 1,
                EUR: 0.85,
                GBP: 0.73,
                JPY: 110,
                IDR: 14500
            };
        }
    }

    convert() {
        if (!this.fromAmount.value || this.fromAmount.value <= 0) {
            this.toAmount.value = '';
            this.updateRateDisplay();
            return;
        }

        const fromCur = this.fromCurrency.value;
        const toCur = this.toCurrency.value;
        const amount = parseFloat(this.fromAmount.value);

        const convertedAmount = this.calculateConversion(amount, fromCur, toCur);
        this.toAmount.value = this.formatAmount(convertedAmount, toCur);
        this.updateRateDisplay();
    }

    calculateConversion(amount, fromCur, toCur) {
        // Convert to USD first
        let usdAmount;
        if (this.isCrypto(fromCur)) {
            usdAmount = amount * (this.cryptoPrices[fromCur]?.price || 0);
        } else {
            usdAmount = amount / (this.rates[fromCur] || 1);
        }

        // Convert from USD to target currency
        if (this.isCrypto(toCur)) {
            return usdAmount / (this.cryptoPrices[toCur]?.price || 1);
        } else {
            return usdAmount * (this.rates[toCur] || 1);
        }
    }

    isCrypto(currency) {
        return ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC'].includes(currency);
    }

    formatAmount(amount, currency, useThousands = false) {
    if (this.isCrypto(currency)) {
        return useThousands
            ? Number(amount).toLocaleString('id-ID', { minimumFractionDigits: 8, maximumFractionDigits: 8 })
            : amount.toFixed(8).replace(/\.?0+$/, '');
    } else {
        return Number(amount).toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}


updateRateDisplay() {
    const fromCur = this.fromCurrency.value;
    const toCur = this.toCurrency.value;
    let amount = parseFloat(this.fromAmount.value);

    // Default ke 1 jika kosong atau tidak valid
    if (isNaN(amount) || amount <= 0) {
        amount = 1;
    }

    const converted = this.calculateConversion(amount, fromCur, toCur);

    const formattedAmount = this.formatAmount(amount, fromCur, true);
    const formattedConverted = this.formatAmount(converted, toCur, true);

    const rateText = document.querySelector('.rate-text');
    rateText.textContent = `${formattedAmount} ${fromCur} = ${formattedConverted} ${toCur}`;
}



    updateCryptoCards() {
        Object.keys(this.cryptoPrices).forEach(crypto => {
            const priceEl = document.getElementById(`${crypto.toLowerCase()}-price`);
            const changeEl = document.getElementById(`${crypto.toLowerCase()}-change`);
            
            if (priceEl && changeEl) {
                const data = this.cryptoPrices[crypto];
                priceEl.textContent = `$${data.price.toLocaleString()}`;
                
                const change = data.change;
                changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                changeEl.className = `crypto-change ${change >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }

    swapCurrencies() {
        const fromVal = this.fromCurrency.value;
        const toVal = this.toCurrency.value;
        const fromAmount = this.fromAmount.value;
        const toAmount = this.toAmount.value;

        this.fromCurrency.value = toVal;
        this.toCurrency.value = fromVal;
        this.fromAmount.value = toAmount;
        
        this.animateSwap();
        this.convert();
    }

    animateSwap() {
        this.swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    }

    animateCard(card) {
        card.style.transform = 'scale(0.95)';
        card.style.boxShadow = '0 0 30px rgba(0, 255, 150, 0.5)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '';
        }, 200);
    }

    showLoading(show) {
        this.isLoading = show;
        this.loadingSpinner.style.display = show ? 'block' : 'none';
        
        if (show) {
            document.body.classList.add('loading');
        } else {
            document.body.classList.remove('loading');
        }
    }

    showError() {
        const rateText = document.querySelector('.rate-text');
        rateText.textContent = 'Error loading rates';
        rateText.style.color = '#ff4444';
    }

    updateLastUpdated() {
        const now = new Date();
        this.lastUpdate = now;
        this.lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }

    startAutoUpdate() {
        // Update every 30 seconds
        setInterval(() => {
            if (!this.isLoading) {
                this.loadData();
            }
        }, 30000);

        // Update UI clock every second
        setInterval(() => {
            if (this.lastUpdate) {
                const timeDiff = Math.floor((Date.now() - this.lastUpdate.getTime()) / 1000);
                const timeAgo = timeDiff < 60 ? `${timeDiff}s ago` : `${Math.floor(timeDiff / 60)}m ago`;
                this.lastUpdated.textContent = `Last updated: ${timeAgo}`;
            }
        }, 1000);
    }
}

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CryptoConverter();
});

// Add some visual effects
document.addEventListener('DOMContentLoaded', () => {
    // Add typing effect to logo
    const logo = document.querySelector('.header h1');
    if (logo) {
        const text = logo.textContent;
        logo.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                logo.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 500);
    }

    // Add floating animation to crypto symbol
    const cryptoIcon = document.querySelector('.crypto-icon');
    if (cryptoIcon) {
        setInterval(() => {
            cryptoIcon.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                cryptoIcon.style.transform = 'translateY(0px)';
            }, 1000);
        }, 2000);
    }
});