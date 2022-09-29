import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";

export default class AlertStore {

  showSuccessAlert: boolean;
  showErrorAlert: boolean;
  successAlertMessage: string;
  errorAlertMessage: string;


  constructor(rootStore:RootStore) { 
    makeAutoObservable(this);
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successAlertMessage = ''
    this.errorAlertMessage = ''
  }

  setShowSuccessAlert(value:boolean,successMessage:string = 'Action was sucessfull!'){
    console.log(`setShowSuccessAlert value ${value}`);
    runInAction(() =>{
      this.resetAlerts();
      this.showSuccessAlert = value;
      this.successAlertMessage = successMessage
      setTimeout(() => {
        this.resetAlerts();
      }, 2000);
    })
  }

  setShowErrorAlert(value:boolean, errorMessage:string = 'Something went wrong!'){
    console.log(`setShowErrorAlert value ${value}`);
    runInAction(() =>{
      this.resetAlerts();
      this.showErrorAlert = value;
      this.errorAlertMessage = errorMessage;
      })
  }

  resetAlerts(){
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successAlertMessage = ''
    this.errorAlertMessage = ''
  }

  
}