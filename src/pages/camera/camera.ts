import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CameraListPage } from '../camera-list/camera-list';

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

 myPhoto: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private filepath: FilePath,
    private platform: Platform,
    private sqlite: SQLite
   ) {
  }

  ngOnInit(){

  this.sqlite.create({
    name: 'data.db',
    location: 'default'
  })
   .then((db: SQLiteObject) => {
    db.executeSql('create table photos(url VARCHAR(200))', {})
    .then(() => console.log('Executed SQL'))
    .catch(e => console.log(e));
   })
    .catch(e => console.log(e));

  }

  choosePhoto(){
   let actionSheet = this.actionSheet.create({
     title:'Selecione uma imagem',
     buttons:[
       {
         text:'Tirar foto',
         handler:()=>{
           this.takePhoto()
         }
       },
       {
         text:'Escolher Foto',
         handler:()=>{
           this.searchPhoto()
         }
       },
       {
         text:'Cancelar',
         role:'cancel'
       }
     ]
   })

   actionSheet.present();
  }


  saveImage(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
     .then((db: SQLiteObject) => {
      return db.executeSql("insert into photos (url) values ('"+ this.myPhoto + "')", {})
     })
     .then(()=>{
       this.navCtrl.push(CameraListPage)
     })
      .catch(e => console.log(e));

    }



  private takePhoto(){

  const options: CameraOptions = {
   quality: 100,
   mediaType: this.camera.MediaType.PICTURE,
   sourceType: this.camera.PictureSourceType.CAMERA,
   destinationType: this.camera.DestinationType.FILE_URI,
   encodingType: this.camera.EncodingType.JPEG,
 }

 this.camera.getPicture(options)
 .then((imageData) =>{

  this.myPhoto =  imageData;

}).catch((err)=>{
  console.log(err);
});
}

  private searchPhoto(){

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

     if(this.platform.is('android')){
        this.filepath.resolveNativePath(imageData)
        .then((filePath)=>{
          this.myPhoto = filePath;
        })
     }else{
        this.myPhoto =  imageData;
     }


  }).catch((err)=>{
     console.log(err);
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

}
