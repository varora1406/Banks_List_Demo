import { Injectable } from '@angular/core';
import { Bank } from './bank';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  private bankData: Bank[] = [];

  banks = new Subject<Bank[]>();
  private bankColumns = ['Favorite', 'IFSC', 'Id', 'Branch', 'Address', 'City', 'District', 'State', 'Bank name'];
  private bankNames: string[] = [];

  constructor() {
    this.fetchData();
  }

  private fetchData() {
    this.fetchFromLocalStorage();
    if (this.bankData.length < 1) {
      this.fetchFromAPI();
    } else {
      this.updateChangesWithBanks();
    }
  }

  private async fetchFromAPI() {
    const dataFromAPI = await fetch('https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI');
    const dataFromResponse: Bank[] = await dataFromAPI.json();
    this.bankData = dataFromResponse;
    this.updateBanksServerSide();
  }

  private fetchFromLocalStorage() {
    if (localStorage.getItem('bank_list')) {
      this.bankData = JSON.parse(localStorage.getItem('bank_list'));
    }
  }

  private updateBanksServerSide() {
    localStorage.setItem('bank_list', JSON.stringify(this.bankData));
    this.updateChangesWithBanks();
  }

  getBanks() {
    return this.bankData;
  }

  private updateChangesWithBanks() {
    this.updateBankNames();
    this.banks.next(this.bankData.slice());
  }

  private updateBankNames() {
    let index = 0;
    for (const bank of this.bankData) {
      bank.index = index;
      index++;

      if (!this.bankNames.includes(bank.bank_name)) {
        this.bankNames.push(bank.bank_name);
      }
    }
  }

  changeFavoriteState(index: number, state: boolean) {
    this.bankData[index].favorite = state;
    this.updateBanksServerSide();
  }

  getBankColumns() {
    return this.bankColumns;
  }

  getBankNames() {
    return this.bankNames;
  }
}
