import React from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreenHeader from '../components/homescreen/HomeScreenHeader';

const Home = () => {
  return (
    <View>
        <View style={{ paddingTop: 20, paddingHorizontal: 15,  }}> 
    <HomeScreenHeader />

        </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})