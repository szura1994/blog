import { Component, Input, OnDestroy, OnInit } from "@angular/core";

//rxjs is all about obserables, essentially about objects that helps us pass data around
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

import { Post } from '../post.model'
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: "This is the first post's content"},
  //   {title: 'Second Post', content: "This is the second post's content"},
  //   {title: 'Third Post', content: "This is the third post's content"},
  // ];

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private postsSub: Subscription = new Subscription;

  //public keyword will automatically create a new property
  // i.e. dun need this.postService = postService etc..
  constructor(public postService: PostsService){}

  // angular will automatically execute when it creates a component
  ngOnInit(){
    this.isLoading = true;
    //because of public declaration above, can just invoke postService this way
    this.postService.getPosts(this.postsPerPage, this.currentPage);

    /*
    * subscribe takes 3 arguments
    * 1. first one is executed whenever new data is emitted (next())
    * 2. second one executed whenever an error is emitted (error())
    * 3. third one is a function that would be called whenever there are no more values to be expected (not possible) (complete())
    *
    * a subject is a special kind of observerable
    *
    * First Argument:
    * set this.posts = posts i.e. update them whenever posts got a new value
    * subscription actually does not cancel whenever this component is torn down
    * right now this component does not disappear because we only got 1 page, but later we will have more components
    * we want to make sure whenever this component is not part of the DOM, the subscriptions which we set up in it
    * are also not living anymore otherwise we'd create a memory leak
    * therefore we will store that subscription in a new property which
    * will be of type Subscription
    * we need to unsub whenever this component is destroyed
    * ngOnDestroy below will be called whenever this component is about to be destroyed
    * unscribe below will remove subscription and prevent memory leak
    */

    //subscribes to the listener created in posts service

    //postsSub is a subscription type created above, to ubsubscribe in onDestroy to prevent memory leak
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onChangePage(pageData: PageEvent) {
    //to load spinner, will be set to false automatically once we get updated posts in ngoninit
    this.isLoading = true;

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

}
