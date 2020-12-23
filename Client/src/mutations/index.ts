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
