class CurrencyConverter {

    resgisterServiceWorker(){
      if('serviceWorker' in navigator){
        navigator.serviceWorker.register('https://buildfuturegroup.com/currency/sw.js').then( (reg) => {
             console.log('your serviceWorker was creates');
        }).catch( (err) => {
           console.log('ServiceWorker registration failed: ', err);
        });
      }
    }

    loadCurrency() {
      fetch('https://free.currencyconverterapi.com/api/v5/currencies').then((response) => {
      return response.json();
      }).then((data) => {
          let currencies = data.results;
          this.createOptionElement(currencies);
        })
    }

    createOptionElement(currencies) {
      for(let currency in currencies){
        let currency_option_from = document.createElement('option');
        let currency_option_to = document.createElement('option');
        currency_option_from.value = currency;
        currency_option_to.value = currency;
        currency_option_from.appendChild(document.createTextNode(currency));
        currency_option_to.appendChild(document.createTextNode(currency));
        currency_from.appendChild(currency_option_from);
        currency_to.appendChild(currency_option_to);
      }
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
      if (amount) {
        let query =`${fromCurrency}_${toCurrency}`;
        let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;
        fetch(url).then(function(response) {
            return response.json();
        }).then((data) => {  
            dbPromise.then(function(db){
                        var tx = db.transaction('currencyConverter', 'readwrite');
                        var converterStore = tx.objectStore('currencyConverter');
                        converterStore.put(data, query);
                          return tx.complete;
                      }).then(function() {
                          console.log('Rates Added');
                      });
                
                let currencyResult = data[query].val
                if (currencyResult !== undefined) {
                          let converted = parseFloat(currencyResult) * parseFloat(amount);
                          result.value = converted;
                          console.log(converted);
                          console.log(result.value);
                  result.appendChild(document.createTextNode(converted));
                      } else {
                        let err = new Error("Value not found for " + query);
                        console.log(err);
                      }
              })
        }
    }
}