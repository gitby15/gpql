let {find, filter} = require('lodash');

module.exports = {
  Query: {
    post() {
      return posts;
    }
  },
  Mutation: {
    upvotePost(_, {postId}){
      const post = find(posts, {id: postId});
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`)
      }
    }
  },

  Author: {
    posts(author) {
      return filter(posts, {authorId: anthor.id});
    }
  },

  Post: {
    author(post) {
      return find(authors, {id:post.authorId})
    }
  }

};