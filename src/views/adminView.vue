<template>
  <div class="container">
    <div class="row">
    <h1>
      container
    </h1>
  </div>
  <div class="row">
    
    <table class="table">
  <thead>
    <tr>
      <th scope="col">firstname</th>
      <th scope="col">lastname</th>
      <th scope="col">userProfile</th>
    
    </tr>
  </thead>
  <tbody>
    <tr  v-for="user in users" :key="user.userID">
    
   
      <th scope="row">{{user.lastname}}</th>
      <td>{{ user.firstname }}</td>
      <td>
        <img :src="user.userProfile" :alt=user.firstname>
      </td>
      
    </tr>
   
  </tbody>
</table>
  </div>
  </div>
</template>
<script>
import {computed} from '@vue/runtime-core';
import {useStore} from 'vuex';
export default{
  setup(){
    const store=useStore();
    store.dispatch('fetchUsers');
    const users = 
    computed(()=>store.state.users);
    return{
      users
    }
  }

}
</script>
