import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";

  //to be able to listened from outside i.e. parent component
  // postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if(form.invalid){
      return
    }
    /*emitting a new post and passing it to the parent component and then passing it down to post list component
    * this works but with bigger and bigger application this becomes cumbersome
    * because got longer chains of property and event binding to do
    * thus easier way of passing data around: service
    */
    // this.postCreated.emit(post);
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
