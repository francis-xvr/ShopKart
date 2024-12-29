
import products from './productData';
import * as THREE from 'three';
import * as WEBGI from 'webgi';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper }  from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {createApp} from "vue/dist/vue.esm-bundler.js";
let rootCollectionApp;

const showProductEvent = new CustomEvent('showproductevent',{
    detail:{
        productid:null
    }
});

const initCollectionApp = function(){
    const app = createApp(
        {
            props:[],
        },
        {
            products: [],
        }
    );
    rootCollectionApp = app;

    app.component('product',{
        props: ['productData','tileh','tilew','rightmargin','isTile'],
        data(){
            return {};
        },
        created(){

        },
        mounted(){
        },
        methods:{
            getImageSrc(){
                return './images/' + this.productData.imagename;
            },
            getColorText(){
                const count = this.productData.color.split(',').length;
                if(count == 1 ){
                    return '1 Colour';
                }else{
                    return count + ' Colours';
                }
            },
            showProduct(){
                showProductEvent.detail.productid = this.productData.id;
                document.dispatchEvent(showProductEvent)
            }
        },
        template:`
            <div class="productContanier" :style="{'height': tileh, 'width': tilew, 'margin-right':rightmargin}">
                <div class="productImageContainer" @click="showProduct()">
                    <img class="productImage" :src="getImageSrc()"/>
                </div>
                <div class="productInfoContainer">
                    <div class="p-price">&#8377;{{productData.price}}</div>
                    <div class="p-name" @click="showProduct()">{{productData.name}}</div>
                    <div class="p-color" :style="{'display':isTile}">{{getColorText()}}</div> 
                </div>
            </div>
        
        `
    });

    app.component('productviewer',{
        props:['productData'],
        data(){
            return{
                isLoaded : false,
                loadPercentage:0,
            }
        },
        created(){
        },
        mounted(){
            this.dom = document.getElementById("viewerScene");
            this.initWebGI();
        },
        unmounted(){
            if(this.viewer!=null){
                this.viewer.renderer.refreshPipeline();
                this.viewer.scene.disposeSceneModels()
                this.viewer.dispose();
            }
        },
        watch:{
            loadPercentage: function(val){
                const loader = document.getElementById('sceneLoaderBar');
                if(loader !=null){
                    loader.style.width = this.loadPercentage + '%';
                }
                if(val===100){
                    this.isLoaded = true;
                }
            },
        }, 
        methods:{
            async initWebGI(){
                this.loadPercentage = 15;
                this.viewer = new WEBGI.ViewerApp({
                    canvas: document.getElementById('viewerScene'),
                    isAntialiased: true,
                    useRgbm: true
                  }) ;
                const manager = new WEBGI.AssetManagerPlugin();
                await this.viewer.addPlugin(manager);
                this.viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 2);
                await WEBGI.addBasePlugins(this.viewer);
                const camViews = this.viewer.getPlugin(WEBGI.CameraViewPlugin);
                this.viewer.renderer.refreshPipeline();
                this.viewer.getPlugin(WEBGI.TonemapPlugin).config.clipBackground = true;
                const options = {autoScale: false}
                const assets = await manager.addFromPath("./objects/"+ this.productData.objModelName, options);
                this.loadPercentage = 80;
                // this.viewer.scene.environment = await manager.importer.importSingle({path:'./images/gem_2.hdr'});
                this.loadPercentage = 90;
                this.controls = this.viewer.scene.activeCamera.controls;
                this.controls.autoRotate = this.turnTable;
                this.controls.autoRotateSpeed = 0.8;
                if(!this.bigCanvas){
                    this.controls.zoomOut(1);
                    this.controls.zoomOut(1);
                }
                this.loadPercentage = 100;
            },
        },
        template:`
            <div id="sceneLoader" v-if="!isLoaded">
                <div id="sceneLoaderBar"></div>
            </div>
            <canvas id="viewerScene"></canvas>
        `
    });

    app.component('collections',{
        props: [],
        data(){
            return {
                rootCmp: rootCollectionApp,
                colSize:4,
                showProductMode: false,
                activeProductId:null,
                activeProduct: null,
            };
        },
        created(){
            rootCollectionApp._props.products = products;
            document.addEventListener('showproductevent',(e)=>{
                if(e.detail.productid!=null){
                    this.activeProductId = e.detail.productid;
                    const pr = rootCollectionApp._props.products.filter((p)=> p.id === this.activeProductId);
                    if(pr.length ==1){
                        this.activeProduct = pr[0];
                        this.showProductMode = true;
                        document.body.scrollTop = 0; // For Safari
                        document.documentElement.scrollTop = 0; 
                        document.dispatchEvent(new Event('resetviewer'));
                    }
                }
            });
        },
        mounted(){
        },
        methods:{
            getRowNum(){
                return Math.ceil(this.rootCmp._props.products.length/this.colSize);
            },
            getIndex(row,col){
                return (row-1)*this.colSize + (col);
            },
            isCellAvailable(row,col){
                if(this.getIndex(row,col) > this.rootCmp._props.products.length)
                    return false;
                return true;
            },
            closeViewer(){
                // document.dispatchEvent(new Event('stoprendering'));
                this.activeProduct = null;
                this.activeProductId = null;
                this.showProductMode = false;
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; 
            },
            getSizeOptions(){
                return this.activeProduct.size.split(',');
            },
            getSuggestedProduct(){
                return rootCollectionApp._props.products.slice(0, 4);
            }

        },
        template: `
            <div id="collectionHeader">
                <nav id="navleft" class="nav js-nav">
                    <ul class="slider-ul">
                    <li class="slider-li">
                    <a class="sliderA" href="/ShopKart/index.html"><span class="navSpan">Home</span></a>
                    </li>
                    <li class="slider-li">
                        <a class="sliderA is-active" href="#"><span class="navSpan">Collections</span></a>
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
            </div>
            <div id="productViewerContainer" v-if="showProductMode">
                <div id="closeViewer" @click="closeViewer()">X</div>
                <div id="productArea">
                    <div id="productViewerBlock">
                        <productviewer :productData=activeProduct></productviewer>
                    </div>
                    <div id="productOptionsContainer">
                        <h1 class="productTitle">{{activeProduct.name}}</h1>
                        <p class="info-price">MRP {{activeProduct.price}}</p>
                        <p class="info-tax">Price inclusive of all taxes</p>
                        <p class="info-price" style="font-size:.875rem">COLOR: <span style="color:#5f5f5f;font-weight:100">{{activeProduct.color}}</span></p>
                        <p class="info-price">CHOOSE SIZE</p>
                        <div class="sizeOptionsBlock">
                            <div class="sizeOptions" v-for="size in getSizeOptions()">
                                {{size}}
                            </div>
                        </div>
                        <div class="cartoptions">
                            <div class="addToCart">ADD TO CART</div>
                            <div class="wishlist"><img style="height:100%;width:100%" src="./images/wishlistheart.svg"/></div>
                        </div>
                        <p class="info-price">DESCRIPTION</p>
                        <div class="detailsText">
                            <ul>
                                <li>{{activeProduct.description}}</li>
                            </ul>
                        </div>
                        <p class="info-price">PRODUCT DETAILS</p>
                        <div class="detailsText">
                            <ul>
                                <li class="detailList" v-for="detail in activeProduct.details.split(',')" >{{detail}}</li>
                            </ul>
                        </div>
                        <p class="info-price">OTHER DETAILS</p>
                        <div class="detailsText">
                            <ul>
                                <li class="detailList" v-for="detail in activeProduct.otherdetails.split(',')" >{{detail}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="suggestionArea">
                    <h1>YOU MAY ALSO LIKE</h1>
                    <div class="productSuggestionBlock">
                        <product v-for="product in getSuggestedProduct()" :productData=product :tileh="'30vh'" :tilew="'20vw'" :rightmargin="'15px'" :isTile="'none'"></product>
                    </div>
                </div>
            </div>
            <div v-else id="collectionBody">
                <div id="filterContainer">
                    <table id="filterTable">
                        <tr>
                            <td ><span id="filterLabel">Filter By</span></td>
                            <td ><div class="filterColumn">Category <div class="downarrow"></div></div></td>
                            <td ><div class="filterColumn">Size <div class="downarrow"></div></div></td>
                            <td ><div class="filterColumn">Color <div class="downarrow"></div></div></td>
                            <td ><div class="filterColumn">Fabric <div class="downarrow"></div></div></td>
                            <td ><div class="filterColumn">Product Type <div class="downarrow"></div></div></td>
                        </tr>
                    </table>
                </div>
                <div id="collectionResultContainer">
                    <table id="collectionTable">
                        <tr v-for="row in Number(getRowNum())">
                            <td class="productGrid" v-for="col in Number(colSize)">
                                <product v-if="isCellAvailable(row,col)" :productData="rootCmp._props.products[getIndex(row,col)-1]"></product>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div id="collectionFooter">
                <div id="footerHead">Diesel private limited</div>
            </div>

        `,
    });
    return app;
}

/***************************
 * 
 * backup old code
 * initScene(){
                const canvaWidth = this.dom.getBoundingClientRect().width;
                const canvaHeight = this.dom.getBoundingClientRect().height;
                this.scene = new THREE.Scene();
                RectAreaLightUniformsLib.init();
                // this.camera = new THREE.OrthographicCamera(canvaWidth / - 35, canvaWidth / 35, canvaHeight / 35, canvaHeight / - 35, 0.1, 2000);
                this.camera = new THREE.PerspectiveCamera(50, canvaWidth /  canvaHeight, 0.1, 2000);
                this.renderer = new THREE.WebGLRenderer({antialias:true});
                this.renderer.physicallyCorrectLights = true;
                this.renderer.setSize( canvaWidth, canvaHeight );
                this.renderer.domElement.style.height = `${canvaHeight} + 'px'`;
                this.renderer.domElement.style.width = `${canvaWidth} + 'px'`; 
                this.renderer.domElement.width = canvaWidth;
                this.renderer.domElement.height = canvaHeight;
                this.dom.appendChild( this.renderer.domElement );
                this.renderer.setClearColor( 0x000000, 0 );

                this.composer = new EffectComposer( this.renderer );
                this.composer.setPixelRatio(window.devicePixelRatio);
                // this.composer.setSize(canvaWidth, canvaHeight);
                const renderPass = new RenderPass( this.scene, this.camera );
                this.composer.addPass( renderPass );

                this.controls = new OrbitControls( this.camera, this.renderer.domElement );
                this.ambLight = new THREE.AmbientLight( 0xffffff ); // soft white light
                this.scene.add( this.ambLight );
                // const axesHelper = new THREE.AxesHelper( 5 );
                // this.scene.add( axesHelper );
                // this.camera.position.set(0,0,100);
                this.camera.position.set(0, 0, 50);
                this.camera.zoom = 1.8;
                this.camera.updateProjectionMatrix();
                if(this.productData.objModelName!=null){
                    this.loadProductGltfModel();
                    // this.loadProductObjModel();
                }
                const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
                pmremGenerator.compileCubemapShader();
                THREE.DefaultLoadingManager.onLoad = function ( ) {
					pmremGenerator.dispose();
				};
                const hdrCubeMap = new RGBELoader()
					.setPath( './images/' )
					.load( 'aircraft_workshop_01_1k.hdr', this.envLoadComplete);

                this.controls.autoRotate = true;
                this.controls.autoRotateSpeed = 1.5;
                this.controls.minDistance = 30;
                this.controls.maxDistance  = 100;
                this.controls.enablePan = false;
                this.startRendering();
            },
            envLoadComplete(texture){
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.environment = texture;
            },
            loadComplete(gltf){
                this.meshes= gltf.scene.children[0].children[0].children[0].children;
                this.scene.add( gltf.scene );
                gltf.scene.position.y = 0;
                gltf.scene.scale.set(7,7,7);
                gltf.scene.rotation.set(-20*Math.PI/180,-10*Math.PI/180,0);
                // console.log(this.meshes);
                // this.meshes[6].material.color = new THREE.Color(0.1,0.2,0.8);
                // this.meshes[7].material.color = new THREE.Color(0.8,0.7,0.1);
            },
            objLoadComplete(object){
                this.scene.add( object );
                object.position.y = -50;
                object.scale.set(0.1,0.1,0.1);
            },
            loadProductObjModel(){
                const loader = new OBJLoader();
                loader.load(
                    // resource URL
                    './objects/' + this.productData.objModelName,
                    // called when resource is loaded
                    this.objLoadComplete,
                    // called when loading is in progresses
                    function ( xhr ) {
                    
                        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                
                    },
                    // called when loading has errors
                    function ( error ) {
                
                        console.log( 'An error happened' );
                
                    }
                );
            },
            loadProductGltfModel(){
                const loader = new GLTFLoader();
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderConfig({ type: 'js' });
                dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );
                loader.setDRACOLoader( dracoLoader );
                loader.load(
                    // resource URL
                    './objects/' + this.productData.objModelName,
                    // called when the resource is loaded
                    this.loadComplete,
                    // called while loading is progressing
                    function ( xhr ) {

                        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                    },
                    // called when loading has errors
                    function ( error ) {

                        console.log( 'An error happened' );

                    }
                );
            },
            animate(){
                this.renderer.render( this.scene, this.camera );
                this.controls.update();
            },
            startRendering(){
                this.renderer.setAnimationLoop(this.animate);
            },
            stopRendering(){
                this.renderer.setAnimationLoop(null);
            }
 */

export {initCollectionApp, rootCollectionApp};