import { Component, AfterViewInit } from '@angular/core';

declare var $: any; // Declare jQuery so TypeScript understands it

interface OwlCarouselOptions {
  autoplay: boolean;
  smartSpeed: number;
  loop: boolean;
  dots: boolean;
  items: number;
}

@Component({
  selector: 'app-screenshot-carousel',
  template: `
    <div class="screenshot-carousel owl-carousel">

      <img class="img-fluid" src="assets/img/week-plan.PNG" alt="">
      <img class="img-fluid" src="assets/img/grocery.PNG" alt="">
      <img class="img-fluid" src="assets/img/recipe.PNG" alt="">
      <img class="img-fluid" src="assets/img/recipeNut.PNG" alt="">
      <img class="img-fluid" src="assets/img/groceryList.PNG" alt="">
    </div>

  `,
})
export class ScreenshotComponent implements AfterViewInit {
  ngAfterViewInit() {
    const carouselOptions: OwlCarouselOptions = {
      autoplay: true,
      smartSpeed: 1000,
      loop: true,
      dots: true,
      items: 1,
    };

    $('.screenshot-carousel').owlCarousel(carouselOptions);
  }
}
