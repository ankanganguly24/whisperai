import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const HomeScreenHeader = () => {
  const handleProPress = () => {
    // Handle Pro button press
    console.log('Pro button pressed')
  }

  const handleSettingsPress = () => {
    // Handle settings button press
    console.log('Settings button pressed')
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Left - Logo and Text */}
        <View style={styles.leftContent}>
          <Image source={require('../../../assets/images/icon.png')} style={styles.logo} />
          <Text style={styles.logoText}>WhisperAI</Text>
        </View>

        {/* Right - Pro Button and Settings Icon */}
        <View style={styles.rightContent}>
          <Pressable
            style={styles.proButton}
            onPress={handleProPress}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
          >
            <Text style={styles.proText}>Pro</Text>
            <Feather name="codepen" size={14} color="#000" style={styles.crownIcon} />
          </Pressable>

          <Pressable
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
          >
            <Feather name="settings" size={20} color="#000" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default HomeScreenHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderRadius: 12,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  proText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  crownIcon: {
    marginTop: 1,
  },
  settingsButton: {
    padding: 8,
  },
})