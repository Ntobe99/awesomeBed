import { createStore } from 'vuex'
import axios from 'axios';
const bedUrl='https://awesomebed-mlis.onrender.com';

export default createStore({
  //commit mutation
  state: {
    users:null,
    user:null,
    products:null,
    product:null,
    showSpinner:null,
    message:null
  },
  getters: {
  },
  //modify the state 
  mutations: {
    setUsers(state,values){
      state.user=values
    },
    setUser(state,value){
      state.user=value
    }

  },

  actions: {
    async fetchUsers(context){
      const res =await axios.get(`${bedUrl}Users`);
      const {results,err}=await res.data
      if(results){
        context.commit('setUsers',results)
      }else{
        context.commit('setMessage',err)
      }
      

    }
  },
  modules: {
  }
})
