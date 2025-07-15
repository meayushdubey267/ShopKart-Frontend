import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.shopKartApiUrl + '/orders';

  constructor(private httpClient : HttpClient) { }

  getOrderHistory(theEmail: string) : Observable<GetResponseOrderHistory> {

    // build URL based on the email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    // make HTTP GET request to the URL 
    // This calls the backend Rest API to get order history
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);

  }
}

// This interface is used to map the response from the backend API
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}