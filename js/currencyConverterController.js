class CurrencyConverter {

    resgisterServiceWorker(){
      if('serviceWorker' in navigator){
        navigator.serviceWorker.register('./sw.js', { scope: './'}).then( (reg) => {
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
      let query =`${fromCurrency}_${toCurrency}`;
      let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;
      dbPromise.then(db => {
        const tx = db.transaction('currencyConverter');
        const converterStore = tx.objectStore('currencyConverter');

        return converterStore.openCursor(query);
        }).then(val => {
        if(val === undefined) {
          fetch(url)
          .then(response => response.json())
          .then(data => {
            dbPromise.then(db => {
              const tx = db.transaction('currencyConverter', 'readwrite');
              const converterStore = tx.objectStore('currencyConverter');
              converterStore.put(data, query);
              return tx.complete;
            }).then(() => {
              console.log('Rates Added');
            });
            
            let currencies = data[query].val;
            let converted = parseFloat(currencies) * parseFloat(amount);
            result.value = converted;
            console.log(converted);
            console.log(result.value);
      result.appendChild(document.createTextNode(converted));
            
          });
        } else {
            let currencies = val._cursor.value;
            for(const key in currencies) {
                console.log(key);
                if( key == query ){
                    let rate = currencies[key].val;
                    let rateConverted = amount * rate;
                    result.value=rateConverted;
                    console.log(rateConverted);
                    result.appendChild(document.createTextNode(rateConverted));   
                }
          }
        }
      });
}

}