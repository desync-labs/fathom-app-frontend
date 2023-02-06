import { makeAutoObservable } from "mobx";

export default class AlertStore {
  showSuccessAlert: boolean;
  showErrorAlert: boolean;
  successAlertMessage: string;
  errorAlertMessage: string;

  constructor() {
    makeAutoObservable(this);
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successAlertMessage = "";
    this.errorAlertMessage = "";
  }

  setShowSuccessAlert(
    value: boolean,
    successMessage: string = "Action was successful!"
  ) {
    this.resetAlerts();
    this.showSuccessAlert = value;
    this.successAlertMessage = successMessage;
    setTimeout(() => {
      this.resetAlerts();
    }, 2000);
  }

  setShowErrorAlert(
    value: boolean,
    errorMessage: string = "Something went wrong!"
  ) {
    this.resetAlerts();
    this.showErrorAlert = value;
    this.errorAlertMessage = errorMessage;
    setTimeout(() => {
      this.resetAlerts();
    }, 2000);
  }

  resetAlerts() {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successAlertMessage = "";
    this.errorAlertMessage = "";
  }
}
