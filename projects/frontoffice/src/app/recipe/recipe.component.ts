
import { Component, AfterViewInit } from '@angular/core';

declare var $: any;

interface OwlCarouselOptions {
  autoplay: boolean;
  smartSpeed: number;
  margin: number;
  loop: boolean;
  center: boolean;
  dots: boolean;
  nav: boolean;
  navText: string[];
  responsive: {
    0: { items: number };
    576: { items: number };
    768: { items: number };
    992: { items: number };
  };
}

@Component({
  selector: 'app-project-carousel',
  template: `
    <div class="project-carousel owl-carousel">



        <a href="" class="d-block product-item rounded">
          <img src="assets/img/groceries-2.jpg" alt="">
          <div class="bg-white shadow-sm text-center p-4 position-relative mt-n5 mx-4">
            <h4 class="text-primary">Save money</h4>
            <span class="text-body">The grocery list feature guarantees that you'll keep track of the exact ingredients you've purchased or need to buy. Say goodbye to ingredients spoiling in your fridge and say hello to money saved in your pocket.</span>
          </div>
        </a>

      <a href="" class="d-block product-item rounded">
        <img src="assets/img/cooking-2.jpg" alt="">
        <div class="bg-white shadow-sm text-center p-4 position-relative mt-n5 mx-4">
          <h4 class="text-primary">Gain time</h4>
          <span class="text-body">When you adopt weekly meal planning, you unlock the power of batch cooking. Prepare multiple delicious recipes in one go, portion them, and store them in your fridge. This straightforward yet effective approach not only saves you precious time but also reduces effort spent in the kitchen. </span>
        </div>
      </a>
      <a href="" class="d-block product-item rounded">
        <img src="assets/img/woman-thinking.jpg" alt="">
        <div class="bg-white shadow-sm text-center p-4 position-relative mt-n5 mx-4">
          <h4 class="text-primary">Less stress</h4>
          <span class="text-body">Thinking about recipes and how to prepare them can be one of the most energy draining tasks for individuals who cook daily. When you plan your weekly meals in advance with our tailored suggestions, you can free yourself from the stress of constant decision-making.</span>
        </div>
      </a>
      <a href="" class="d-block product-item rounded">
        <img src="assets/img/recipe-2.jpg" alt="">
        <div class="bg-white shadow-sm text-center p-4 position-relative mt-n5 mx-4">
          <h4 class="text-primary">More variety</h4>
          <span class="text-body">Our recipe suggestion algorithm and detailed videos make trying new recipes a breeze, adding more variety and fun to your diet. </span>
        </div>
      </a>
      <a href="" class="d-block product-item rounded">
        <img src="assets/img/scale.jpg" alt="">
        <div class="bg-white shadow-sm text-center p-4 position-relative mt-n5 mx-4">
          <h4 class="text-primary">Reach your health goals</h4>
          <span class="text-body">With our calorie needs calculator and tracker features, you can monitor your calorie intake throughout the week, ensuring you stay on the path to reach your desired goals.</span>
        </div>
      </a>

    </div>
  `,
})
export class RecipeComponent implements AfterViewInit {
  // Configuration for the carousel
  carouselOptions: OwlCarouselOptions = {
    autoplay: true,
    smartSpeed: 1000,
    margin: 25,
    loop: true,
    center: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
    },
  };

  ngAfterViewInit() {
    // Initialize the Owl Carousel after the view is initialized
    $('.project-carousel').owlCarousel(this.carouselOptions);
  }
}

