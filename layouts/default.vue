<template>
  <v-app>
    <v-navigation-drawer app></v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-title>
        Crowd Coin
      </v-toolbar-title>
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn>
          Campaigns
        </v-btn>
        <v-btn>
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
