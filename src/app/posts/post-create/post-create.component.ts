import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle = "";
  enteredContent = "";
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;
  post: Post;

  //to be able to listened from outside i.e. parent component
  // postCreated = new EventEmitter<Post>();

  //ActivatedRoute helps us identy how this path information/component is loaded.. i.e. which path
  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    //retrieve parama map to see if postId exists in path... if it does.. its for edit i.e. edit mode
    //paramMap is an observerable of which we can subscribe
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
        console.log('Edit Post: '+this.postId)
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if(this.form.invalid){
      return;
    }
    //don't need to set this to false as we will navigate away from this page
    //and when we come back, isLoading will be set to false
    this.isLoading = true;
    if (this.mode === 'create'){
      /*emitting a new post and passing it to the parent component and then passing it down to post list component
      * this works but with bigger and bigger application this becomes cumbersome
      * because got longer chains of property and event binding to do
      * thus easier way of passing data around: service
      */
      // this.postCreated.emit(post);
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }

    this.form.reset();
  }
}
