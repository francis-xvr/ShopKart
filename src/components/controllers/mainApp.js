import { Slider } from "./slider";
import {createApp} from "vue";
let rootApp;

const initMainApp = function(){
    const app = createApp(
        {
            props:[],
        },
        {

        }
    );
    rootApp = app;

    app.component('homebgscene',{
        props: [],
        data(){
            return {};
        },
        created(){

        },
        mounted(){
            const slider = new Slider();
        },
        methods:{

        },
        template: `
            <nav id="navleft" class="nav js-nav">
                <ul class="slider-ul">
                <li class="slider-li">
                <a class="sliderA is-active" href="#"><span class="navSpan">Home</span></a>
                </li>
                <li class="slider-li">
                    <a class="sliderA" href="/ShopKart/collections.html"><span class="navSpan">Collections</span></a>
                </li>
                <li class="slider-li">
                        <a class="sliderA" href="#"><span class="navSpan">Contact Us</span></a>
                </li>
                </ul>
            </nav>
            <figure class="logo">
                <img src="./images/Diesel_logo.svg">
            </figure>
            <nav id="navright" class="nav">
                <ul class="slider-ul">
                    <li class="slider-li">
                    <a class="sliderA" href="#">
                        <span>Account</span>
                    </a>
                    </li>
                    <li class="slider-li">
                    <a class="sliderA" href="#">
                        <span>Cart</span>
                        <div class="cart-total">0</div>
                    </a>
                    </li>
                </ul>
            </nav>
            <div class="slider js-slider">
                <div class="slider__inner js-slider__inner"></div>
  
                <div class="slide js-slide">
                    <div class="slide__content">
                    <figure class="slide__img js-slide__img">
                        <img src="./images/p1.jpg">
                    </figure>
                    <figure class="slide__img js-slide__img">
                        <img src="./images/p2.jpg">
                    </figure>
                </div>
    
                <div class="slider__text js-slider__text">
                    <div class="slider__text-line js-slider__text-line"><div><span style="color:#82a882">Green</span> is</div></div>
                    <div class="slider__text-line js-slider__text-line"><div>timeless. Green is</div></div>
                    <div class="slider__text-line js-slider__text-line"><div>the colour of</div></div>
                    <div class="slider__text-line js-slider__text-line"><div>Eternity.</div></div>
                </div>
    
            </div>
  
  <div class="slide js-slide">
    <div class="slide__content">
      <figure class="slide__img js-slide__img">
        <img src="./images/p3.jpg">
      </figure>
       <figure class="slide__img js-slide__img">
        <img src="./images/p4.jpg">
      </figure>
    </div>
    <div class="slider__text js-slider__text">
        <div class="slider__text-line js-slider__text-line"><div><span style="color:#6799c2">Blue</span> is</div></div>
        <div class="slider__text-line js-slider__text-line"><div>the colour of</div></div>
        <div class="slider__text-line js-slider__text-line"><div>Mindfulness.</div></div>
    </div>
  </div>
  
  <div class="slide js-slide">
    <div class="slide__content">
      <figure class="slide__img js-slide__img">
        <img src="./images/p7.png">
      </figure>
       <figure class="slide__img js-slide__img">
        <img src="./images/p5.jpg">
      </figure>
    </div>
    <div class="slider__text js-slider__text">
    <div class="slider__text-line js-slider__text-line"><div style="color:#00e763">Celebrate</div></div>
    <div class="slider__text-line js-slider__text-line"><div><span style="color:rgb(217, 80, 253)">the</span> <span style="color:rgb(216, 255, 9)">colours</span></div></div>
    <div class="slider__text-line js-slider__text-line"><div><span style="color:rgb(4 ,255, 245)">of</span> <span style="color:#ff0000">World.</span></div></div>
    </div>
  </div>
  <nav class="slider__nav js-slider__nav">
    <div class="slider-bullet js-slider-bullet">
      <span class="slider-bullet__text js-slider-bullet__text">01</span>
      <span class="slider-bullet__line js-slider-bullet__line"></span>
    </div>
     <div class="slider-bullet js-slider-bullet">
      <span class="slider-bullet__text js-slider-bullet__text">02</span>
      <span class="slider-bullet__line js-slider-bullet__line"></span>
    </div>
     <div class="slider-bullet js-slider-bullet">
      <span class="slider-bullet__text js-slider-bullet__text">03</span>
      <span class="slider-bullet__line js-slider-bullet__line"></span>
    </div>
  </nav>
  
  <div class="scroll js-scroll">Scroll</div>
  
</div>
        `,
    });
    return app;
}

export {initMainApp, rootApp};