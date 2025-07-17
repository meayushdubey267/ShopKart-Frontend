import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product! : Product ;
  isLoading: boolean = true; // 🔹 Add loading flag
  constructor(private productService : ProductService , 
              private cartService : CartService,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })
  }
  handleProductDetails(){

    // get the "id" param string and use +  to convert string into a  number using + symbol
    const theProductId : number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(
      data =>{
        this.product = data;
        this.isLoading = false; // 🔹 Stop loading when data is received
      }
    )
  }
  addToCart(){
    console.log(`Product Name : ${this.product.name} , Unit Price : ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
    
  }
}
