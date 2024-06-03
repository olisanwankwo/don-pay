export class Apis {
    async fetchDataPlans(network) {
      try {
        const response = await fetch('http://localhost:8080/https://api.live.redbiller.com/1.0/bills/data/plans/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'private-key': 'PRI_nvglngkpzMhixsMVlUXdtDpUo5xUOef560DjGD3VQmSjADyFVwmTXuZ4rmSA9f3olayWVFBcqU4iyz5kAYMiSJ7Jcu81OWbi'
          },
          body: JSON.stringify({
            product: network
          })
        });
        const data = await response.json();
        return data;
      } catch (err) {
        console.log(err.message);
      }
    }
  
    async purchaseData(params) {
      try {
        const response = await fetch('http://localhost:8080/https://api.live.redbiller.com/1.0/bills/data/plans/purchase/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'private-key': 'PRI_nvglngkpzMhixsMVlUXdtDpUo5xUOef560DjGD3VQmSjADyFVwmTXuZ4rmSA9f3olayWVFBcqU4iyz5kAYMiSJ7Jcu81OWbi'
          },
          body: JSON.stringify(params)
        });
        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err.message);
      }
    }
  
    async purchaseAirtime(params) {
      try {
        const response = await fetch('http://localhost:8080/https://api.live.redbiller.com/1.0/bills/airtime/purchase/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'private-key': 'PRI_nvglngkpzMhixsMVlUXdtDpUo5xUOef560DjGD3VQmSjADyFVwmTXuZ4rmSA9f3olayWVFBcqU4iyz5kAYMiSJ7Jcu81OWbi'
          },
          body: JSON.stringify(params)
        });
        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err.message);
      }
    }
  }
  