import { Component } from '@angular/core';
import { MobileHeader } from './mobile-header/mobile-header';
import { Departments } from "./departments/departments";
import { Search } from "./search/search";
import { MainMenu } from './main-menu/main-menu';
import { CartDropdown } from './cart-dropdown/cart-dropdown';
import { AccountDropdown } from './account-dropdown/account-dropdown';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MobileHeader, Departments, Search, MainMenu, CartDropdown, AccountDropdown],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {

}
