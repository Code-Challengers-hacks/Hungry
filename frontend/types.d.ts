type MenuItem = {
    name: string
    price: number
    description: string
    image: String
    sellerName: string
    id: number
}

type User = {
    name: string
    orderHistory: Cart[]
    carts: Cart[]
    feedbacks: Feedback[]
    id: number
}

type Feedback = {
    feedback: string
    username: string
    adminName: string
    rating: number
    id: number
}

type UserItem = {
    name: string
    price: number
    quantity: number
    adminName: string
    id: number
}

type Seller = {
    name: string
    menuCard: MenuItem[]
    users: User[]
    feedbacks: Feedback[]
    orders: Cart[]
    id: number
}

type Cart = {
    items: UserItem[]
    total: number
    username: string
    adminName: string
    id: number
}

type AuthState = {
    name: string | null,
    mode: string | null,
}

interface LoginAction {
    type: 'LOGIN';
    payload: {
        name: string;
        mode: string;
    };
}

interface LogoutAction {
    type: 'LOGOUT';
}

type AuthAction = LoginAction | LogoutAction;

type AuthContextValue = {
    name: string | null;
    mode: string | null;
    dispatch: React.Dispatch<AuthAction>;
};

type localStore = {
    name: string,
    email: string,
    id: Number,
    token: string,
    mode: string
}

type CurrentCart = {
    items: UserItem[],
    total: number,
    adminName: String,
    id: number
}

type OrderedCart = {
    items: UserItem[],
    total: number,
    username: String,
    id: number
}

type SellerUser = {
    id: number,
    username: String,
    email: String
}

interface CREATE_MENU {
    type: 'CREATE_MENU';
    payload: {
        menu : MenuItem
    };
}

interface SET_MENU {
    type: 'SET_MENU';
    payload: {
        menu : MenuItem
    }
}

interface DELETE_MENU {
    type: 'DELETE_MENU';
    payload: {
        menu : MenuItem
    }
}

interface UPDATE_PRICE{
    type : 'UPDATE_PRICE';
    payload : {
        item : MenuItem
        price : number
    }
}

type MenuAction = CREATE_MENU | SET_MENU | DELETE_MENU | UPDATE_PRICE | any;

type MenuContextValue = {
    menu : MenuItem[]
    dispatch: React.Dispatch<MenuAction>;
};

type MenuState = {
    menu : MenuItem[]
}

interface CREATE_FEEDBACK {
    type: 'CREATE_FEEDBACK';
    payload: {
        feedback : Feedback
    };
}

interface SET_FEEDBACK {
    type: 'SET_FEEDBACK';
    payload: {
        feedback : Feedback
    }
}

type FeedbackAction = CREATE_FEEDBACK | SET_FEEDBACK | any;

type FeedbackContextValue = {
    feedback : Feedback[]
    dispatch: React.Dispatch<FeedbackAction>;
};

type FeedbackState = {
    feedback : Feedback[]
}

interface CREATE_CART {
    type: 'CREATE_CART';
    payload: {
        cart : CurrentCart
    };
}

interface SET_CARTS {
    type: 'SET_CARTS';
    payload: {
        cart : CurrentCart
    }
}

interface DELETE_CART {
    type: 'DELETE_CART';
    payload: {
        cart : CurrentCart
    }
}

interface DELETE_CART_ITEM {
    type: 'DELETE_CART_ITEM';
    payload: {
        cart : CurrentCart
    }
}

interface PLACE_ORDER {
    type: 'PLACE_ORDER';
    payload: {
        cart : CurrentCart
    }
}

interface UPDATE_QUANTITY{
    type : 'UPDATE_QUANTITY';
    payload : {
        item : UserItem
        quantity : number
        total : number
    }
}

interface UPDATE_BY_QUANTITY{
    type : 'UPDATE_QUANTITY';
    payload : {
        item : UserItem
        quantity : number
    }
}

interface UPDATE_CART_TOTAL{
    type : 'UPDATE_CART_TOTAL';
    payload : {
        id : number
        total : number
    }
}

interface ADD_ITEMS_CART{
    type : 'ADD_ITEMS_CART';
    payload : {
        id : number
        item : UserItem
    }
}


type CartAction = CREATE_CART | SET_CARTS | DELETE_CART | UPDATE_QUANTITY | DELETE_CART_ITEM | PLACE_ORDER | UPDATE_CART_TOTAL | ADD_ITEMS_CART | any;

type CartContextValue = {
    cart : CurrentCart[]
    dispatch: React.Dispatch<CartAction>;
};

type CartState = {
    cart : CurrentCart[]
}

interface CREATE_ORDERED {
    type: 'CREATE_ORDERED';
    payload: {
        ordered : CurrentCart
    };
}

interface SET_ORDERED {
    type: 'SET_ORDERED';
    payload: {
        ordered : CurrentCart
    }
}

type OrderedAction = CREATE_ORDERED | SET_ORDERED | any;

type OrderedContextValue = {
    ordered : CurrentCart[]
    dispatch: React.Dispatch<OrderedAction>;
};

type OrderedState = {
    ordered : CurrentCart[]
}

interface SET_SELLER_ORDERS {
    type: 'SET_SELLER_ORDERS';
    payload: {
        sellerOrders : OrderedCart
    };
}

interface CREATE_SELLER_ORDER {
    type: 'CREATE_SELLER_ORDER';
    payload: {
        sellerOrders : OrderedCart
    }
}

interface DELETE_SELLER_ORDER {
    type : 'DELETE_SELLER_ORDER';
    payload: {
        sellerOrders : OrderedCart
    }
}

type SellerOrdersAction = SET_SELLER_ORDERS | CREATE_SELLER_ORDER | DELETE_SELLER_ORDER | any;

type SellerOrdersContextValue = {
    sellerOrders : OrderedCart[]
    dispatch: React.Dispatch<SellerOrdersAction>;
};

type SellerOrdersState = {
    sellerOrders : OrderedCart[]
}