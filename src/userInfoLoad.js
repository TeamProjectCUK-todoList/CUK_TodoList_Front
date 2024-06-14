import { call } from './service/ApiService';

export const loadUser = () => {
  const accessId = localStorage.getItem("userId");
  // alert("accessId: " +  accessId);
  return call("/user/myProvider", "POST", { accessId } )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Failed to load user:", error);
      throw error;
    });
};