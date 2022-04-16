import { Injectable } from '@angular/core';
import { Post } from './post.model';
//rxjs package: objects that help us pass data around
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/*
* Service is a class which you add to your angular application
* which you let inject by angular into components and which is able to centralize
* some tasks and provide easy access to data from within different components without
* property and even binding
*/

/*
* Injectible Angular will find it
*/
@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router){}

  // method which allows retieval of posts
  getPosts(){
    //this 3 dots is like creating a new array and not directly the original posts
    /* reason is cause of reference type vs primitive
    * essentially a reference tpye is a type where if you copy it you dont really copy it
    * you just copied the address, so the pointer pointing at that object
    * to make a true copy of the posts, we use next gen js feature called the spread operator
    * thress dots creates a new array with the old objects and therefore this array has been copied
    * to not affect the original array
    */
    // return [...this.posts];

    /*
    * I want to reach out to my backend, fetch the posts, store them in posts here and then fire
    * my update listener to inform everyone interest in my app that we got new posts
    *
    * Http Client
    *
    * get() expects a path to our backend server
    * .subscribe to listen
    */
    this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
      //to transform _id into id
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(transformedPosts => {
        //postsData is an element of the object we specified in the get method ^
        //this get method extracts and formats the data from json to js
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  //listens to the subject
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    /*
    * fetch object from the post array in the posts service
    * with the help of the find method
    * there a function will be executed on every post in the array
    * and if it returns true, this is the post object it will return
    */
    // return {...this.posts.find(p => p.id === id)}
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/"+ id);
  }

  addPost(title: string, content: string, image: File) {
    /* instead of sending json which does not support files
    *  we should send form data which is a data format which allows to combine
    *  text valus and file values
    */
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    //previous json method
    // const post: Post = {id: null as any, title: title, content: content};
    //message & postId is expected to be returned after invoking api api/posts
    this.http
      .post<{ message: string, post: Post }>(
        "http://localhost:3000/api/posts",
        postData
        )
      //responseData is the first argument of the subscribe method i.e. only called for success responses
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        //update the local post with an id sent back from api
        // const id = responseData.postId;
        // post.id = id;

        //push the new post to the local posts here if we really have a successful respnse from server side
        this.posts.push(post);

        //copy of my posts after i updated in previous ^ step
        //take the subject (postsUpdated) & next pushes new value, it emits a new value
        //and this value is a copy of the posts after its updated
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }

  updatePost(id: string, title: string, content: string, image: File | string ){
    // const post: Post = { id:id, title: title, content: content, imagePath: null};
    let postData: Post | FormData;
    if (typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        //locally update post after you got a success response
        const updatedPosts = [...this.posts]
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string){
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log('Post ID:'+ postId + ' deleted.')
      })
  }
}
