import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,ActionSheetController, ViewController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import {Comment} from '../../shared/comment'
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


import {CommentsPage} from '../../pages/comments/comments'


/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  favorite: boolean;
  numcomments: number;
  comment:Comment;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice: FavoriteProvider,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private socialSharing: SocialSharing) {
    
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);

    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }
  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }

  openComments() {

    let modal = this.modalCtrl.create(CommentsPage);
    modal.onDidDismiss(data => {
      this.comment = data ;
      let d = new Date();
      this.comment.date = d.toISOString();
      this.dish.comments.push(this.comment);
    })
    modal.present();
  }

  presentActionSheet(){
  const actionSheet = this.actionSheetCtrl.create({
    title: 'Select Actions',
    buttons: [
      {
        text: 'Share via Facebook',
        handler: () => {
          this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to Facebook'))
            .catch(() => console.log('Failed to post to Facebook'));
        }
      },
      {
        text: 'Share via Twitter',
        handler: () => {
          this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to Twitter'))
            .catch(() => console.log('Failed to post to Twitter'));
        }
      },
      {
        text: 'Add to favorites',
        handler: () => {
          this.addToFavorites();
        }
      },
      {
        text: 'Add Comment',
        handler: () => {
         this.openComments();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
actionSheet.present();
  
}

}
