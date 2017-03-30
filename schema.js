module.exports  = `
  type Author {
    id:Int!
    firstName: String
    lastName: String
    post: [Post]
  }

  type Post {
    id: Int!
    title: String 
    author: Author
    votes: Int
  }
  
  typeQuery {
    posts:[Post]
    
  }
  
  type Mutation {
    upvotePost(
      postId: Int!
    ):Post
  }
  
  
  schema {
    query: Query
    mutation:Mutation
  }
`;