import { gql } from '@apollo/client';

export const REGISGTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      code
      success
      message
      user {
        _id
        username
        email
        password
        token
      }
    }
  }
`;

export const USER_LOGIN = gql`
  mutation LoginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      code
      success
      message
      user {
        username
        token
        password
        email
        _id
      }
    }
  }
`;

export const CATEGORIES = gql`
  query GetCategories($amount: Int) {
    getCategories(amount: $amount) {
      _id
      title
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($amount: Int, $categoryId: ID!) {
    getProducts(amount: $amount, CATEGORY_ID: $categoryId) {
      _id
      name
      img
      price
      description
      createdAt
      updatedAt
      category {
        _id
        title
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $userId: ID!) {
    addToCart(PRODUCT_ID: $productId, USER_ID: $userId) {
      code
      success
      message
    }
  }
`;

export const GET_TOTAL_CART_COUNT = gql`
  query GetTotalCount($amount: Int!, $id: ID!) {
    getTotalCount(amount: $amount, ID: $id) {
      quantity
    }
  }
`;

export const GET_PRODUCT_CART_QUANTITY = gql`
  query ShowCartItems($amount: Int!, $id: ID!) {
    showCartItems(amount: $amount, ID: $id) {
      product {
        _id
      }
      quantity
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query ShowCartItems($amount: Int!, $id: ID!) {
    showCartItems(amount: $amount, ID: $id) {
      product {
        _id
        price
        name
        img
        description
      }
      quantity
      added_by {
        _id
        username
        email
      }
    }
  }
`;

export const GET_CART_PRICE = gql`
  query GetTotalPrice($amount: Int!, $id: ID!) {
    getTotalPrice(amount: $amount, ID: $id) {
      price
    }
  }
`;

export const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($productId: ID!, $userId: ID) {
    removeItemFromCart(PRODUCT_ID: $productId, USER_ID: $userId) {
      code
      success
      message
    }
  }
`;

export const REMOVE_CART_ON_SUCCESS_PAYMENT = gql`
  mutation RemoveCartOnSuccessPayment($userId: ID) {
    removeCartOnSuccessPayment(USER_ID: $userId) {
      code
      success
      message
    }
  }
`;

export const GET_LATEST_ORDER = gql`
  query GetLatestOrder($amount: Int!, $id: ID!) {
    getLatestOrder(amount: $amount, ID: $id) {
      user {
        username
        _id
      }
      orders {
        order {
          price
          img
          name
          description
          _id
        }
        quantity
      }
    }
  }
`;

export const SHOW_ALL_ORDERS = gql`
  query ShowAllOrders($amount: Int!, $id: ID!) {
    showAllOrders(amount: $amount, ID: $id) {
      _id
      orders {
        quantity
        order {
          price
          name
          img
          description
          _id
        }
      }
      createdAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($productId: ID!) {
    getProduct(PRODUCT_ID: $productId) {
      price
      name
      img
      description
      category {
        title
      }
      _id
    }
  }
`;
