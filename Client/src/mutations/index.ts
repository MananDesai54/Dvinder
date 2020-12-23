export const REGISTER_MUTATION = `
  mutation Register($email: String!, $password: String!, $username: String!){
    registerUser(
      userData: {
        email: $email
        password: $password
        username: $username
      }
    ) {
      user{
        username
        id
        email
      }
      errors {
        message
        field
      }
    }
  } 
`;

export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!){
    login(authData: {password: $password, email: $email}) {
      user {
        id
        email
        username
      }
      errors {
        field
        message
      }
      success
    }
  }
`;
