import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // Initialize the Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement!: any;
  displayError: any = '';

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Setup Stripe Payment Form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    // read the user's email from the browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        //  cardType : new FormControl('' , [Validators.required ]),
        //  nameOnCard :new FormControl('' , [Validators.required,
        //                                   Validators.minLength(2),
        //                                   Luv2ShopValidators.notOnlyWhitespace ]),
        //  cardNumber : new FormControl('' , [Validators.required,
        //                                   Validators.pattern('[0-9]{16}')]),
        //  securityCode :  new FormControl('' , [Validators.required,
        //                                   Validators.pattern('[0-9]{3}')]),
        //  expirationMonth : [''],
        //  expirationYear : ['']
      }),
    });

    /*
    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1; // getMonth() returns 0-11, so we add 1
    console.log(`startMonth: ${startMonth}`);
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Credit Card Months: ${JSON.stringify(data)}`);
        
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log(`Credit Card Years: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      }
    );    

    */

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe((data) => {
      console.log(`Retrieved Countries: ${JSON.stringify(data)}`);
      this.countries = data;
    });
  }

  setupStripePaymentForm() {
    // get a  handle to stripe  elements
    var elements = this.stripe.elements();

    // create a card element and hide the zip code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of Card UI component into the `card-element` div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      // get a handle to card errors element
      this.displayError = document.getElementById('card-errors');

      if (event.error) {
        // show validation error message
        this.displayError.textContent = event.error.message;
      } else if (event.complete) {
        // clear any previous error message
        this.displayError.textContent = '';
      }
    });
  }
  reviewCartDetails() {
    // Subscribe to the cart service to get the total quantity

    this.cartService.totalQuantity.subscribe((totalQuantity) => {
      this.totalQuantity = totalQuantity;
    });

    // Subscribe to the cart service to get the total price
    this.cartService.totalPrice.subscribe((totalPrice) => {
      this.totalPrice = totalPrice;
    });
  }

  // Getter methods to access the controls in the form

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value,
        (this.billingAddressStates = this.shippingAddressStates) // Copy states as well
      );
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.checkoutFormGroup.controls['billingAddress'].enable();
    }
  }

  onSubmit() {
    console.log(`Handling the submit button `);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from the cart items

    // A LONG way to do this would be to use a for loop
    // let orderItems: any[] = [];
    // for(let i = 0; i < cartItems.length; i++){
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    // A better way to do this is to use the map function
    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    // set up purchase
    let purchase = new Purchase();

    // populate purchase customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    // populate purchase billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;

    // populate purchase shipping address
    const shippingState: State = purchase.shippingAddress?.state
      ? JSON.parse(JSON.stringify(purchase.shippingAddress.state))
      : undefined;
    const shippingCountry: Country = purchase.shippingAddress?.country
      ? JSON.parse(JSON.stringify(purchase.shippingAddress.country))
      : undefined;

    if (
      purchase.shippingAddress &&
      shippingState?.name &&
      shippingCountry?.name
    ) {
      purchase.shippingAddress.state = shippingState.name as string;
      purchase.shippingAddress.country = shippingCountry.name as string;
    }

    // populate purchase billing address
    const billingState: State = purchase.billingAddress?.state
      ? JSON.parse(JSON.stringify(purchase.billingAddress.state))
      : undefined;
    const billingCountry: Country = purchase.billingAddress?.country
      ? JSON.parse(JSON.stringify(purchase.billingAddress.country))
      : undefined;

    if (purchase.billingAddress && billingState?.name && billingCountry?.name) {
      purchase.billingAddress.state = billingState.name as string;
      purchase.billingAddress.country = billingCountry.name as string;
    }

    // populate purchase order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100); // convert to cents
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer?.email;

    //  if valid form then
    // -> create paymentt intent
    // -> confirm card payment
    // -> place order

    if (
      !this.checkoutFormGroup.invalid && this.displayError.textContent === '') {

        this.isDisabled = true; // disable the form to prevent multiple submissions
      // 1. create payment intent
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer?.email,
                    name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                    address: {
                      line1:purchase.billingAddress?.street,
                      city: purchase.billingAddress?.city,
                      state: purchase.billingAddress?.state,
                      postal_code:purchase.billingAddress?.zipCode,
                      country: this.billingAddressCountry?.value.code
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                // inform the user , there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false; // re-enable the form
              } else {
                // call REST API via the checkout service
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                    );
                    // reset cart
                    this.resetCart();
                    this.isDisabled = false; // re-enable the form
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false; // re-enable the form
                  },
                });
              }
            });
        });
    } else {
      // display error message
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    // reset the cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();  // updates storage with latest cart items 

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
  }
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.exprirationYear
    );

    // if the selected year equals the current year, then start with the current month
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so we add 1
    } else {
      startMonth = 1; // January
    }
    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log(`Credit Card Months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      });
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName}: country code: ${countryCode} `);
    console.log(`${formGroupName}: country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // select first item by default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
