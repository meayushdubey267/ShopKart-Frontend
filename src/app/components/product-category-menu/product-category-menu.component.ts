import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {
productCategories:ProductCategory[]=[];
categoryIcon: string = '';
  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }
  listProductCategories(){
    this.productService.getProductCategories().subscribe(
     data => {
       console.log(JSON.stringify(data))
      this.productCategories = data.map((cat: any) => ({
  ...cat,
  categoryIcon: this.getIconForCategory(cat.categoryName)
}));

     //this.productCategories=data;
    }
    );
  }
  getIconForCategory(name: string): string {
  switch (name.toLowerCase()) {
    case 'books':
      return 'fa-book';
    case 'coffee mugs':
      return 'fa-mug-hot';
    case 'mouse pads':
      return 'fa-computer-mouse';
    case 'luggage tags':
      return 'fa-tag';
    default:
      return 'fa-box'; // default fallback
  }
}

}