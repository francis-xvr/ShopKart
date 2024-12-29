import './style.css'
import { initMainApp } from './components/controllers/mainApp';
import { initCollectionApp } from './components/controllers/collectionApp';

async function main(){
    const mainApp = initMainApp();
    mainApp.mount('#mainAppContainer');
    const collectionApp = initCollectionApp();
    collectionApp.mount('#collectionAppContainer');
}

main();
