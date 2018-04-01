<template>
  <v-app>
    <v-navigation-drawer app></v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-title>
        Im the header
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app>
      <v-layout row>
        <v-flex xs12>Im the footer</v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>
