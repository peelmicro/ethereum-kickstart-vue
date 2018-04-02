<template>
  <v-app>
    <v-toolbar app class="mt-2 ml-2 mr-2">
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">CrownCoin</router-link>
      </v-toolbar-title>      
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn flat to="/">
          Campaigns
        </v-btn>
        <v-btn flat to="/campaigns/new">
          <v-icon left>add_circle</v-icon>
          Add
        </v-btn>        
      </v-toolbar-items>     
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>
