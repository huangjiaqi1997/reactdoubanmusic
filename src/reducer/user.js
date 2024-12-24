import axios from "axios";
import Cookies from "js-cookie";

// user
const userInitialState = {
  userID: "",
  error: { message: "" },
  theme: 2,
};

const USER_GET_USERID = "USER_GET_USERID";
const USER_AUTH_SUCCESS = "USER_AUTH_SUCCESS"; // reducer操作相同
const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
const USER_ERR = "USER_ERR";
const USER_CHANGE_THEME = "USER_CHANGE_THEME";

// actionID
const authSuccess = (payload) => ({
  type: USER_AUTH_SUCCESS,
  ...payload,
});
export const logout = () => {
  Cookies.remove("userID");
  return { type: USER_LOGOUT_SUCCESS };
};

const error = (data) => ({
  data,
  type: USER_ERR,
});

export const getUserID = () => {
  return { type: USER_GET_USERID, userID: Cookies.get("userID") };
};
export const changeTheme = (num) => {
  return { num, type: USER_CHANGE_THEME };
};

export const login = (data) => {
  // const {email, password} = data;
  // const URL = `/login?email=${'13702056736@163.com'}&password=${'a19970715'}`
  const URL = `/music/login`;
  // axios.get('/captcha/sent?phone=15022661328')
  return (dispatch) => {
    axios
      .post(URL, data)
      .then((res) => {
        const { code, message } = res.data;
        if (code === 200) {
          Cookies.set("userID", res.data.account.id);
          dispatch(authSuccess({ userID: res.data.account.id }));
        } else {
          dispatch(error({ message }));
        }
      })
      .catch((err) => {
        dispatch(error({ message: "当前登录存在安全风险，请稍后再试" }));
      });
  };
};
// export const logout = () => {

// /logout接口 调用失败
// return dispatch => {
//   axios.get('/logout')
//     .then(res => {
//       if (res.data.code === 200) {
//         Cookies.remove('userID')
//         dispatch(logoutSuccess());
//       } else {
//         dispatch(error(res.data.code));
//       }
//     })
// }
// }

export const register = (data) => {
  return (dispatch) => {
    axios.post("/music/register", data).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(authSuccess(res.data.data));
      } else {
        dispatch(error(res.data.msg));
      }
    });
  };
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case USER_GET_USERID:
      return {
        ...state,
        userID: action.userID,
      };
    case USER_AUTH_SUCCESS:
      return {
        ...state,
        userID: action.userID,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        userID: "",
      };
    case USER_ERR:
      return {
        ...state,
        error: action.data,
      };
    case USER_CHANGE_THEME:
      return {
        ...state,
        theme: action.num,
      };
    default:
      return state;
  }
};

export default userReducer;
