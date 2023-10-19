import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ResourceService } from './service/resource.service';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { ToastController } from '@ionic/angular';
import { AddResourceComponent } from './add-resource/add-resource.component';
import {StaticDataConstants} from '../../core/constant/staticData.constants'
@Component({
  selector: 'app-resource',
  templateUrl: './resource.page.html',
  styleUrls: ['./resource.page.scss'],
})
export class ResourcePage implements OnInit {

  showSearch: boolean = false;
  items: any = [];
  skip:number = 0;
  searchQuery:string = '';

  resourceData: any;
  isModalOpen: boolean = false;
  modelType!: string;


  @ViewChild('add') add !: AddResourceComponent;

  constructor(private resourceService: ResourceService,private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.getResources(this.skip,20,this.searchQuery);
  }

  saveForm() {
    console.log('Add form   ',this.add.isFormValid())
    if (this.add.isFormValid()) {
      this.resourceService.addresource(this.add.addform.value)
      .subscribe((data: any) => {
        this.add.setClose();
        this.getResources(this.skip,20,this.searchQuery);
      });
    }
  }

  onSearch() {
    this.showSearch = !this.showSearch;
  }

  handleSearch(event:any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.items = [];
    this.skip = 0;
    this.getResources(this.skip,20,this.searchQuery);
  }


  private getResources(skip:number,limit:number,search:string) {
    this.resourceService.getResources(skip,limit,search)
      .subscribe((data: any) => {
        console.log("Resources:----  ",data)
        this.items = [...this.items,...data.data.resourceInfo];
      });

  }

  private deleteResource(id:string,index:number){
    this.resourceService.deleteResource(id).subscribe({
      next: (response:any) => {
        this.presentToast(response?.message)
        this.modalCtrl.dismiss();
        this.items.splice(index,1);
      },
      error: (response) => {
        this.presentToast(response.message)
      },
    });      
  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  onIonInfinite(ev: any) {
    this.skip = this.skip + 20;
    this.getResources(this.skip,20,this.searchQuery);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async deleteModal(item:any,index:number,sliding:any) {
    let data = {
      "from": "Resource",
      "type": "Delete",
      "value": item.name
    }
    const mySubject = new BehaviorSubject(data);

    const modal = await this.modalCtrl.create({
      component: DeleteNavComponent,
      breakpoints: [0, 0.5,1],
      initialBreakpoint: 0.3,
      handle: false,
      componentProps: {
        mySubject
      },
    });
    await modal.present();

    mySubject.subscribe((value: any) => {
      console.log(value)
      if(value== true){
        this.deleteResource(item.resource_id,index);
      }
    });

    modal.onDidDismiss().then((_ => {
      mySubject.unsubscribe();
    }));
    sliding.close();
  }


  detailData(info: any, type: string) {
    this.resourceData = info;
    this.modelType = type;
    this.isModalOpen = true;
  }
  setOpen(isOpen: boolean) {
    this.resourceData = undefined;
    this.modelType = isOpen ? 'save' : 'edit';
    this.isModalOpen = isOpen;
  }

  editEvent(type: string) {
    this.modelType = type;
  }
}
