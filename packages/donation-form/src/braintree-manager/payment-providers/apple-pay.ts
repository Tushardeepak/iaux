import { BraintreeManagerInterface } from "../braintree-manager";
import { ApplePaySessionManagerInterface } from "./apple-pay-session-manager";

export interface ApplePayHandlerInterface {
  isAvailable(): Promise<boolean>;
  getApplePayInstance(): Promise<any | undefined>;
  createPaymentRequest(): Promise<any>;
}

export class ApplePayHandler implements ApplePayHandlerInterface {
  constructor(
    braintreeManager: BraintreeManagerInterface,
    applePaySessionManager: ApplePaySessionManagerInterface
  ) {
    this.braintreeManager = braintreeManager;
    this.applePaySessionManager = applePaySessionManager;
  }

  private braintreeManager: BraintreeManagerInterface;

  private applePaySessionManager: ApplePaySessionManagerInterface;

  private applePayInstance: any | undefined;

  async isAvailable(): Promise<boolean> {
    try {
      await this.getApplePayInstance();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }

  async getApplePayInstance(): Promise<any | undefined> {
    if (this.applePayInstance) {
      return this.applePayInstance;
    }

    const braintreeClient = await this.braintreeManager.getInstance();
    const braintree = this.braintreeManager.braintree;

    return new Promise((resolve, reject) => {
      braintree.applePay.create({
        client: braintreeClient
      }, (error: any, instance: any) => {
        console.log('instance', error, instance, instance.merchantIdentifier);
        if (error) {
          return reject(error);
        }

        if (!this.applePaySessionManager?.canMakePayments()) {
          return reject('Apple Pay unavailable');
        }

        this.applePayInstance = instance;
        resolve(instance);
      });
    });
  }

  async createPaymentRequest(): Promise<any> {
    const applePayInstance = await this.getApplePayInstance();

    const paymentRequest = applePayInstance.createPaymentRequest({
      total: {
        label: 'My Company',
        amount: '19.99'
      }
    });
    var session = this.applePaySessionManager.createNewPaymentSession(paymentRequest);

    session.onvalidatemerchant = function (event) {
      applePayInstance.performValidation({
        validationURL: event.validationURL,
        displayName: 'My Great Store'
      }, (validationErr: any, validationData: any) => {
        if (validationErr) {
          console.error(validationErr);
          session.abort();
          return;
        }
        console.log('validate merchange', validationData);

        session.completeMerchantValidation(validationData);
      });
    };
    console.log('session', session);
  }
}
