import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.services';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  constructor(public photoService: PhotoService) {} //Inyectamos el servicio de PhotoService

  async ngOnInit() {
    await this.photoService.loadSaved(); //Cuando cargue el componente lo primero que ejecutara sera la funcion loadSaved()
  }

  addPhotoToGallery() {
    //Funcion que se ejecuta cuando el usuario agregue una nueva foto
    this.photoService.addNewToGallery();
  }


}
