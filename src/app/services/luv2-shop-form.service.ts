import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = environment.shopKartApiUrl + "/countries";
  private statesUrl =environment.shopKartApiUrl +  "/states"; 

  constructor(private httpClient : HttpClient) { }

  getCountries() : Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      // map the response to the countries array
      map(response => response._embedded.countries)
    );  
  }

  getStates(theCountryCode: string): Observable<State[]> {
    // search by country code
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      // map the response to the states array
      map(response => response._embedded.states)
    );
  }


  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    // build an array of "Months dropdown list"
    // start at current month and loop until the month end 

    for( let theMonth = startMonth; theMonth <= 12; theMonth++ ) {
      data.push(theMonth);
    }
    return of(data); //of operator of rxjs will wrap the object as an Observable .
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    // build an array of "Years dropdown list"
    // start at current year and loop for the next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for( let theYear = startYear; theYear <= endYear; theYear++ ) {
      data.push(theYear);
    }
    return of(data); //of operator of rxjs will wrap the object as an Observable .
  }
}
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}




// Note: The above interfaces are used to define the structure of the response from the API.
// They help TypeScript understand the shape of the data being returned, allowing for better type checking and autocompletion in the code editor.
// The `GetResponseCountries` interface describes the structure of the response for countries, which includes an `_embedded` property containing an array of `Country` objects.
// The `GetResponseStates` interface describes the structure of the response for states, which includes an `_embedded` property containing an array of `State` objects.
// This approach ensures that the data returned from the API is correctly typed, making it easier to work with in the application.
// Note: The `getCreditCardMonths` and `getCreditCardYears` methods return arrays of numbers wrapped in an Observable using the `of` operator from RxJS.
// This allows the methods to be used in a reactive programming style, where the data can be subscribed to and updated as needed.
// The `getCreditCardMonths` method generates an array of months starting from the provided `startMonth` up to 12.
// The `getCreditCardYears` method generates an array of years starting from the current year up to 10 years in the future.
// This is useful for populating dropdown lists in forms, such as credit card expiration dates.
// The `getCountries` and `getStates` methods make HTTP GET requests to the specified URLs to retrieve the list of countries and states, respectively.
// The `getCountries` method returns an Observable of an array of `Country` objects, while the `getStates` method returns an Observable of an array of `State` objects.
// The `getStates` method takes a `theCountryCode` parameter to filter states by country code.
// The `map` operator from RxJS is used to transform the response data into the desired format, extracting the `_embedded` property containing the relevant arrays.
// This service can be injected into components or other services to provide access to country and state data, as well as credit card month and year options for forms.
// This service is useful for applications that require user input for shipping addresses, billing information, or payment methods.
// It allows for easy retrieval of countries and states, as well as credit card expiration options, enhancing the user experience by providing relevant data dynamically.
// The service is designed to be reusable and can be easily integrated into various parts of the application where such data is needed.
// This service is a key part of the application's form handling functionality, ensuring that users have access to the necessary data for completing forms related to shipping and billing.                                   