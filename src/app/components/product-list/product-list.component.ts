import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  currentCategoryId : number=1 ;
  previousCategoryId : number=1 ;
  searchMode : boolean = false;

  // new properties for pagination 

  thePageNumber : number = 1;
  thePageSize : number = 10;
  theTotalElements : number = 0;


  previousKeyword : string = "";

  constructor(private productService  : ProductService , 
    private cartService : CartService ,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  
  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts(); 
    }
    else{

      this.handleListProducts();
    }
  }


  handleSearchProducts(){
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    // if we have different search product than  previous then set the Page Number to 1
    if(this.previousKeyword!=theKeyword){
      this.thePageNumber=1;
    }

    this.previousKeyword=theKeyword;
    console.log(`keyword: ${theKeyword} , thePageNumber: ${this.thePageNumber}`);
    

    // now search for the product using the given keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                                this.thePageSize,theKeyword).subscribe(this.processResult());                            

  }


  handleListProducts(){

    
    //check if the "id" parameter is available
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // get the id param string and convert the string to a nummber using '+' symbol 
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      // if the category id is not present choose a default category id : in this case 1 

      this.currentCategoryId = 1;
    }


    // Check is we have a different category than previous 
    // Note : Angular we reuse the component if it is currently being viewed
    // 
    // if we have a different category id than previous , the set the pageNumber back to 1 
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId} , thePageNumber = ${this.thePageNumber}`);
    

    // now get the products for that particular product id.
    this.productService.getProductListPaginate(this.thePageNumber-1 , 
                                              this.thePageSize , 
                                              this.currentCategoryId).subscribe(this.processResult());

  }
  updatePageSize(pageSize : string){
    this.thePageSize = +pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  processResult(){
    return (data : any) =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
    };
  }

  addToCart(theProduct :  Product){
    console.log(`Added to Cart : ${theProduct.name} , ${theProduct.unitPrice}`);
    
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);


  }
}
