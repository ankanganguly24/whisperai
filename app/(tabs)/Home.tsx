import React from 'react';
import { StyleSheet, View } from 'react-native';
import AgentListComp from '../components/homescreen/AgentListComp';
import HomeScreenHeader from '../components/homescreen/HomeScreenHeader';

const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 20, paddingHorizontal: 15 }}>
        <HomeScreenHeader />
        
        <View style={{ marginVertical: 15 }} />
        <AgentListComp />
      </View>   
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})