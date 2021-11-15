import axios from 'axios';
axios.defaults.baseURL="localhost:8000/api";
axios.defaults.withCredentials = true;
 const apis={
    loginEmail : (email)=>axios.post('/accounts/',{email,}),
    verifyEmail : (email,otp)=>axios.post('/accounts/verify',{email,otp}),
    verifyLogin:(email,otp)=>axios.get('/accounts/verify'),
    addContact:(email)=>axios.post('/contacts/add',{email}),
    viewContact:()=>axios.get('/contacts/'),
    viewChats:(room)=>axios.get('/chats/',{params:{room,}}),
    addContacts:(email)=>axios.post('/contacts/add',{email}),
    editProfile:(user_id,name,about)=>axios.put(`/accounts/profile/${user_id}`,{name,about}),
    editImage:(user_id,formData)=>axios({
        method: "put",
        url: `/accounts/profile/${user_id}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
}
export default apis;